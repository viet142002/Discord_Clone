import { Session } from '@prisma/client';

export enum Platform {
    MOBILE = 'MOBILE',
    WEB = 'WEB',
}

export class SessionEntity implements Session {
    id: string;
    userId: string;
    device: string;
    platform: Platform;
    refreshKey: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<SessionEntity>) {
        Object.assign(this, partial);
    }
}
