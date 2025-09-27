import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService],
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return {
                    secret: configService.get('JWT_ACCESS_ACCESS_KEY'),
                    signOptions: {
                        expiresIn: configService.get(
                            'JWT_ACCESS_EXPIRATION_TIME',
                        ),
                    },
                };
            },
        }),
    ],
})
export class AuthModule {}
