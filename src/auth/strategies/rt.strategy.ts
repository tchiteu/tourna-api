import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserFromJwt } from '../models/UserFromJwt';
import { UserPayload } from '../models/UserPayload';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.RT_JWT_SECRET,
    });
  }

  async validate(req: Request, payload: UserPayload): Promise<UserFromJwt> {
    const refreshToken = req.get('authorization').replace('Bearer', '');

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      refreshToken,
    };
  }
}
