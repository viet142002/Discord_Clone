import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nService } from 'src/modules/i18n/i18n.service';

@Catch(BadRequestException)
export class I18nBadRequestFilter implements ExceptionFilter {
    private i18nService = new I18nService();
    constructor() {}
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const lang = request.lang || 'en';
        const res = exception.getResponse() as {
            message: string[];
            error: string;
        };

        const translated: string[] = (res.message || []).map((msg: string) =>
            this.i18nService.translate(msg, lang),
        );

        response.status(status).json({
            statusCode: status,
            message: translated,
            error: res.error,
        });
    }
}
