import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class StoreService {
  constructor(private readonly redisService: RedisService) {}
  client = this.redisService.getClient('tourna');

  add(key, value) {
    this.client.set(key, value);
  }
}
