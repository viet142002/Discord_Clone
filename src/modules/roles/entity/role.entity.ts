import { Role } from '@prisma/client';

export class RoleEntity implements Role {
    name: string;
    id: string;
    serverId: string;
    isOwner: boolean;

    constructor(partial: Partial<RoleEntity>) {
        Object.assign(this, partial);
    }
}
