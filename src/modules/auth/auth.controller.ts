import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { KEY_STORES } from 'src/common/constants';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { Public } from 'src/common/decorators';
import { I18nService } from 'src/modules/i18n/i18n.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private i18nService: I18nService,
    ) {}

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const platform = req.platform;
        const dataLogin = await this.authService.login(loginDto, platform);
        res.cookie(KEY_STORES.ACCESS_TOKEN, 'Bearer ' + dataLogin.accessToken, {
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

    @Public()
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        const found = await this.authService.userExists({
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

    @Post('logout')
    async logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        if (!req.user) {
            throw new BadRequestException('USER_NOT_FOUND');
        }
        await this.authService.logout(req.user.sessionId);
        res.clearCookie(KEY_STORES.ACCESS_TOKEN, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
        });
        res.clearCookie(KEY_STORES.REFRESH_TOKEN, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/auth/refresh',
        });
        return {
            message: this.i18nService.translate('USER_LOGOUT_SUCCESS'),
        };
    }

    @Public()
    @Post('refresh')
    refresh() {
        return 'refresh';
    }
}
