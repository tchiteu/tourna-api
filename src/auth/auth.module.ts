import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StoreModule } from 'src/redis/store.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy, AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [PrismaModule, StoreModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AtStrategy, RtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
