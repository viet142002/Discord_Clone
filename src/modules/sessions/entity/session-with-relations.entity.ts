import { Prisma } from '@prisma/client';

import { SessionEntity } from './session.entity';
import { UserEntity } from 'src/modules/users/entity/user.entity';

type SessionOptionalRelations = Partial<
    Prisma.SessionGetPayload<{
        include: {
            user: { omit: { password: true } };
        };
        select: {
            user: true;
            userId: true;
        };
    }>
>;

export class SessionWithRelationsEntity
    extends SessionEntity
    implements SessionOptionalRelations
{
    user?: Omit<UserEntity, 'password'>;
}
