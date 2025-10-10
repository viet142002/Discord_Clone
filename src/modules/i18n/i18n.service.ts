import { Injectable } from '@nestjs/common';

import * as vi from './lang/vi.json';
import * as en from './lang/en.json';
import { RequestContext } from 'src/middlewares/requestContext.middleware';

export type Lang = 'en' | 'vi';

@Injectable()
export class I18nService {
    private translation: Record<Lang, Record<string, string>> = {
        en,
        vi,
    };

    translate(key: string): string {
        const lang = RequestContext.current?.lang || 'en';
        return this.translation[lang][key] || key;
    }
}
