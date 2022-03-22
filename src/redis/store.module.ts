import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { StoreService } from './store.service';

@Module({
  imports: [
    RedisModule.register({
      name: 'tourna',
      url: process.env.REDIS_URL,
      port: parseInt(process.env.REDIS_PORT),
    }),
  ],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
