import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class DeviceMiddleware {
    private regexMobile =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    use(req: Request, _, next) {
        const xPlatform = req.headers['x-platform'] || '';

        if (xPlatform === 'mobile' || xPlatform === 'web') {
            req.platform = xPlatform;
            next();
            return;
        }

        const userAgent = req.headers['user-agent'] || '';
        req.platform = this.regexMobile.test(userAgent) ? 'mobile' : 'web';
        next();
    }
}
