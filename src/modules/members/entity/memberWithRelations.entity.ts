import { Prisma } from '@prisma/client';

import { MemberEntity } from './member.entity';
import { ServerEntity } from 'src/modules/servers/entity/server.entity';
import { UserEntity } from 'src/modules/users/entity/user.entity';

type MemberOptionalRelations = Partial<
    Prisma.MemberGetPayload<{
        include: {
            server: true;
            user: { omit: { password: true } };
        };
        select: {
            server: true;
            user: true;
        };
    }>
>;

export class MemberWithRelationsEntity
    extends MemberEntity
    implements MemberOptionalRelations
{
    server?: ServerEntity;
    user?: Omit<UserEntity, 'password'>;
}
