import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './models/UserPayload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/UserToken';
import { StoreService } from 'src/redis/store.service';
import { Tokens } from './models/Tokens';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly storeService: StoreService,
    private readonly prismaService: PrismaService,
  ) {}

  async login(user: User): Promise<UserToken> {
    const tokens = await this.getTokens(user.id, user.email);

    // Set access token on Redis
    this.storeService.add(`${user.id}`, tokens.access_token);

    // Update refresh token on db
    this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(user: User) {
    const { id } = user;

    return this.storeService.remove(`${id}`);
  }

  async validateUser(email: string, password: string) {
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

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

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await bcrypt.hash(rt, 10);

    await this.prismaService.users.update({
      where: {
        id: userId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async getTokens(userId: number, userEmail: string): Promise<Tokens> {
    const payload: UserPayload = {
      sub: userId,
      email: userEmail,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.AT_JWT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.RT_JWT_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
