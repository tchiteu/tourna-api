import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

@Injectable()
export class StoreService {
  constructor(private readonly redisService: RedisService) {}
  private client = this.redisService.getClient('tourna');

  add(key: string, value: any, expires = 259200) {
    this.client.set(key, value, 'EX', expires);
  }

  remove(key: string) {
    this.client.del(key);
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }
}
