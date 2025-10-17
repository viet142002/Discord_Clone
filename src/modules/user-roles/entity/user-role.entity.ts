import { UserRole } from '@prisma/client';

export class UserRoleEntity implements UserRole {
    id: string;
    roleId: string;
    userId: string;

    constructor(partial: Partial<UserRoleEntity>) {
        Object.assign(this, partial);
    }
}
