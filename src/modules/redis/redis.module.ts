import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from 'src/modules/redis/redis.service';

@Global()
@Module({
    imports: [],
    providers: [
        {
            provide: 'REDIS_CLIENT',
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const redisConfig: Record<string, unknown> =
                    configService.get('redis') || {};
                const redis = new Redis({
                    host: redisConfig.REDIS_HOST as string,
                    port: redisConfig.REDIS_PORT as number,
                });

                redis.on('connect', () => {
                    console.log('Connected to Redis');
                });
                redis.on('error', (err) => {
                    console.log('Redis Client Error', err);
                });
                return redis;
            },
        },
        RedisService,
    ],
    exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
