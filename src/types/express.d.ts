import 'express';

import { Platform } from '@prisma/client';

declare module 'express' {
    export interface Request {
        lang?: 'en' | 'vi';
        user?: {
            id: string;
            sessionId: string;
        };
        platform: Platform;
    }
}
