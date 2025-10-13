import { Prisma } from '@prisma/client';

import { UserRoleEntity } from './userRole.entity';
import { RoleEntity } from 'src/modules/roles/entity/role.entity';
import { UserEntity } from 'src/modules/users/entity/user.entity';

type UserRoleOptionalRelations = Partial<
    Prisma.UserRoleGetPayload<{
        include: {
            role: true;
            user: { omit: { password: true } };
        };
        select: {
            role: true;
            user: true;
        };
    }>
>;

export class UserRoleWithRelationsEntity
    extends UserRoleEntity
    implements UserRoleOptionalRelations
{
    role?: RoleEntity;
    user?: UserEntity;
}
