import 'express';

declare module 'express' {
    export interface Request {
        lang?: 'en' | 'vi';
    }
}
