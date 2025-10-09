import { Server } from '@prisma/client';

export class ServerEntity implements Server {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(partial: Partial<ServerEntity>) {
        Object.assign(this, partial);
    }
}
