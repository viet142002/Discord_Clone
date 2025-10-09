import { User } from '@prisma/client';

export class UserEntity implements User {
    id: string;
    loginId: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    name: string;
    email: string;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
