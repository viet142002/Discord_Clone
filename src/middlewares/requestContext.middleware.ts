import { Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response, NextFunction } from 'express';
import { Lang } from 'src/modules/i18n/i18n.service';

interface ContextData {
    lang: Lang;
    request: Request;
}

@Injectable()
export class RequestContext {
    private static storage = new AsyncLocalStorage<ContextData>();

    static get current(): ContextData | undefined {
        return this.storage.getStore();
    }

    static run(context: ContextData, callback: () => void) {
        this.storage.run(context, callback);
    }
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    use(req: Request, _res: Response, next: NextFunction) {
        const lang = req.lang;
        RequestContext.run({ lang, request: req }, () => {
            next();
        });
    }
}
