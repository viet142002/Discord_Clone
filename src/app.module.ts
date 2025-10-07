import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import configuration from 'src/configs/configuration';
import { typeOrmConfig } from 'src/configs/typeorm.config';
import { LangMiddleware } from 'src/middlewares/lang.middleware';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ChannelModule } from 'src/modules/channels/channel.module';
import { I18nModule } from 'src/modules/i18n/i18n.module';
import { RedisModule } from 'src/modules/redis/redis.module';
import { MembershipModule } from 'src/modules/serverMemberships/membership.module';
import { ServersModule } from 'src/modules/servers/servers.module';
import { SessionModule } from 'src/modules/sessions/session.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
    imports: [
        AuthModule,
        UsersModule,
        I18nModule,
        ServersModule,
        MembershipModule,
        ChannelModule,
        SessionModule,
        RedisModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: typeOrmConfig,
            inject: [ConfigService],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'src', 'public'),
            serveRoot: '/public',
        }),
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LangMiddleware).forRoutes('*');
    }
}
