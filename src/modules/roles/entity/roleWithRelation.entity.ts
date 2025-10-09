import { Prisma } from '@prisma/client';

import { RoleEntity } from './role.entity';
import { ChannelRolePermissionEntity } from 'src/modules/channelRolePermissions/entity/channelRolePermission.entity';
import { MemberEntity } from 'src/modules/members/entity/member.entity';

type RoleOptionalRelations = Partial<
    Prisma.RoleGetPayload<{
        include: {
            users: {
                include: {
                    user: { omit: { password: true } };
                };
            };
            channelRolePermission: true;
            server: true;
        };
        select: {
            users: true;
            channelPermission: true;
            server: true;
        };
    }>
>;

export class RoleWithRelationsEntity
    extends RoleEntity
    implements RoleOptionalRelations
{
    // users?: ;
    channelRolePermissions?: ChannelRolePermissionEntity[];
    members?: MemberEntity[];
}
