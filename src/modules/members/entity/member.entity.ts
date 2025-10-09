import { Member } from '@prisma/client';

export class MemberEntity implements Member {
    id: string;
    userId: string;
    serverId: string;
    joinedAt: Date;

    constructor(partial: Partial<MemberEntity>) {
        Object.assign(this, partial);
    }
}
