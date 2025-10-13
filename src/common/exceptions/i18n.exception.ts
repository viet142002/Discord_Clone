import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'src/modules/i18n/i18n.service';

interface IResponse {
    message: string[];
    error: string;
}

@Catch()
export class I18nBadRequestFilter implements ExceptionFilter {
    private i18nService = new I18nService();
    constructor() {}
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        if (!!exception.getStatus && !!exception.getResponse) {
            this.commonException(exception, response);
            return;
        }

        if ('code' in exception && exception.code === 'P2025') {
            this.deleteNotFoundException(response);
            return;
        }

        console.log(exception.message);
        this.unknownException(response);
    }

    commonException(
        exception: HttpException,
        response: Response<any, Record<string, any>>,
    ) {
        const status = exception.getStatus();
        const res = exception.getResponse() as IResponse;

        const messages = Array.isArray(res.message)
            ? res.message
            : [res.message];

        const translated = messages.map((msg) =>
            this.i18nService.translate(msg),
        );

        return response.status(status).json({
            statusCode: status,
            message: translated,
            error: res.error || exception.name,
        });
    }

    deleteNotFoundException(response: Response<any, Record<string, any>>) {
        return response.status(404).json({
            statusCode: 404,
            message: [this.i18nService.translate('NOT_FOUND')],
            error: 'Not Found',
        });
    }

    unknownException(response: Response<any, Record<string, any>>) {
        return response.status(500).json({
            statusCode: 500,
            message: [this.i18nService.translate('INTERNAL_SERVER_ERROR')],
            error: 'Internal Server Error',
        });
    }
}
