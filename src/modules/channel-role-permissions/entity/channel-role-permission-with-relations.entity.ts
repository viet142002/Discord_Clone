import { Prisma } from '@prisma/client';

import { ChannelRolePermissionEntity } from './channel-role-permission.entity';
import { ChannelEntity } from 'src/modules/channels/entity/channel.entity';

type ChannelRolePermissionOptionalRelations = Partial<
    Prisma.ChannelRolePermissionGetPayload<{
        include: {
            channel: true;
            role: true;
        };
        select: {
            role: true;
            channel: true;
        };
    }>
>;

export class ChannelRolePermissionWithRelationsEntity
    extends ChannelRolePermissionEntity
    implements ChannelRolePermissionOptionalRelations
{
    channel?: ChannelEntity;
    // role?: RoleEntity;
}
