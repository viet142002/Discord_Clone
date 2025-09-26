import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LangMiddleware } from 'src/middlewares/lang.middleware';
import { AuthModule } from 'src/modules/auth/auth.module';
import { I18nModule } from 'src/modules/i18n/i18n.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
    imports: [AuthModule, UsersModule, I18nModule],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LangMiddleware).forRoutes('*');
    }
}
