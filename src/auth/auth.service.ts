import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { StoreService } from 'src/redis/store.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly storeService: StoreService,
  ) {}

  async login(user: User): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const jwtToken = await this.jwtService.sign(payload);

    // Set token on Redis
    this.storeService.add(`${user.id}`, jwtToken);

    return {
      access_token: jwtToken,
    };
  }

  async logout(user: User) {
    const { id } = user;

    return this.storeService.remove(`${id}`);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid = await compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new Error('Email address or password provided is incorrect.');
  }

  async verifyToken(token: string): Promise<boolean> {
    const { sub: id } = this.jwtService.decode(token);
    const redisToken = await this.storeService.get(id);

    return redisToken && redisToken === token;
  }
}
