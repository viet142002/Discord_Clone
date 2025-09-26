import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Header = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const req: Request = ctx.switchToHttp().getRequest();
        return data ? req.headers[data] : req.headers;
    },
);
