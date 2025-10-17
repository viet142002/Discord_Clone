import { Prisma } from '@prisma/client';
import { UserEntity } from 'src/modules/users/entity/user.entity';

type UserOptionalRelations = Partial<
    Prisma.UserGetPayload<{
        include: {
            members: true;
            roles: true;
            sessions: true;
        };
        select: {
            members: true;
            roles: true;
            sessions: true;
        };
        omit: {
            password: true;
        };
    }>
>;

export class UserWithRelationsEntity
    extends UserEntity
    implements UserOptionalRelations {}
