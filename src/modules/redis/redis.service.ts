import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    constructor(
        @Inject('REDIS_CLIENT')
        private readonly redis: Redis,
    ) {}

    async set(
        {
            key,
            value,
            keyS,
            ttl,
        }: {
            keyS?: string;
            key: string;
            value: any;
            ttl?: number;
        },
        otps: { sadd?: boolean } = {},
    ) {
        const data = typeof value === 'string' ? value : JSON.stringify(value);
        if (ttl) {
            await this.redis.set(key, data, 'EX', ttl);
        } else {
            await this.redis.set(key, data);
        }

        if (otps?.sadd && keyS) {
            await this.redis.sadd(keyS, key);
        }
    }

    async get<T = any>(key: string): Promise<T | null> {
        const data = await this.redis.get(key);
        if (!data) return null;
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return JSON.parse(data);
        } catch {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return data as any;
        }
    }

    async del(key: string) {
        await this.redis.del(key);
    }

    async keys(pattern: string) {
        return this.redis.keys(pattern);
    }

    async flushAll() {
        await this.redis.flushall();
    }

    async smembers(key: string) {
        return this.redis.smembers(key);
    }

    getClient(): Redis {
        return this.redis;
    }
}
