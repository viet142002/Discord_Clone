import { Role } from '@prisma/client';

export class RoleEntity implements Role {
    name: string;
    id: string;
    serverId: string;

    constructor(partial: Partial<RoleEntity>) {
        Object.assign(this, partial);
    }
}
