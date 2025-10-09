import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from 'src/modules/auth/auth.service';
import { IS_PUBLIC_KEY } from 'src/common/decorators';
import { SessionService } from 'src/modules/sessions/session.service';
import { KEY_STORES } from 'src/common/constants';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private sessionService: SessionService,
        private reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const req: Request = context.switchToHttp().getRequest();
        const token = this.extractToken(req);

        if (!token) {
            throw new UnauthorizedException('CANT_ACCESS_RESOURCE');
        }

        const payload = await this.authService.verifyToken(token, 'access');

        if (!payload) {
            throw new UnauthorizedException('TOKEN_NOT_VALID');
        }

        const session = await this.sessionService.findUnique({
            where: {
                id: payload.sessionId,
            },
        });

        if (!session) {
            throw new UnauthorizedException('TOKEN_IS_EXPIRED');
        }

        req['user'] = payload;
        return true;
    }

    extractToken(req: Request): string | undefined {
        const tokenFromCookie = req.cookies[KEY_STORES.ACCESS_TOKEN] as
            | string
            | undefined;
        const tokenFromHeader: string | undefined = req.headers.authorization;

        const [type, token] =
            tokenFromCookie?.split(' ') ?? tokenFromHeader?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
