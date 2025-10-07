import 'express';
import { Platform } from 'src/modules/sessions/dto/CreateSession.dto';

declare module 'express' {
    export interface Request {
        lang?: 'en' | 'vi';
        user?: {
            username: string;
            id: string;
            role: string;
            sessionId: string;
        };
        platform: Platform;
    }
}
