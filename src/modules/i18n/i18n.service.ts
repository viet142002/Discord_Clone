import { Injectable } from '@nestjs/common';

import * as vi from './lang/vi.json';
import * as en from './lang/en.json';

type Lang = 'en' | 'vi';

@Injectable()
export class I18nService {
    private translation: Record<Lang, Record<string, string>> = {
        en,
        vi,
    };

    translate(key: string, lang: Lang = 'en'): string {
        return this.translation[lang][key] || key;
    }
}
