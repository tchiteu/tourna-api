import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class StoreService {
  constructor(private readonly redisService: RedisService) {}
  private client = this.redisService.getClient('tourna');

  add(key: string, value: any) {
    this.client.set(key, value);
  }
}
