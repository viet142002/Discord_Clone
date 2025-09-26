import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LangMiddleware {
    use(req: Request, _, next) {
        req.lang = (req.headers['accept-language'] as 'en' | 'vi') || 'en';
        next();
    }
}
