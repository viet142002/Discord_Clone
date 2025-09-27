import { I18nService } from 'src/modules/i18n/i18n.service';
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { KEY_STORES } from 'src/common/constants';
import type { Response } from 'express';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private i18nService: I18nService,
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const dataLogin = await this.authService.login(loginDto);
        res.cookie(KEY_STORES.ACCESS_TOKEN, dataLogin.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
        });
        res.cookie(KEY_STORES.REFRESH_TOKEN, dataLogin.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/auth/refresh',
        });

        return {
            data: {
                user: dataLogin.user,
            },
            message: this.i18nService.translate('USER_LOGIN_SUCCESS'),
        };
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        const found = await this.authService.userExists({
            username: registerDto.username,
            email: registerDto.email,
        });

        if (found) {
            throw new BadRequestException('USER_EXISTS');
        }
        await this.authService.register(registerDto);
        return {
            message: this.i18nService.translate('USER_REGISTER_SUCCESS'),
        };
    }

    @Get('logout')
    logout() {
        return 'logout';
    }

    @Get('refresh')
    refresh() {
        return 'refresh';
    }
}
