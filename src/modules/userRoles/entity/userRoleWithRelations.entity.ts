import { Prisma } from '@prisma/client';

import { UserRoleEntity } from './userRole.entity';
import { ChannelEntity } from 'src/modules/channels/entity/channel.entity';
import { MemberEntity } from 'src/modules/members/entity/member.entity';
import { RoleEntity } from 'src/modules/roles/entity/role.entity';

type ServerOptionalRelations = Partial<
    Prisma.ServerGetPayload<{
        include: {
            channels: true;
            members: true;
            roles: true;
        };
        select: {
            channels: true;
            members: true;
            roles: true;
        };
    }>
>;

export class ServerWithRelationsEntity
    extends UserRoleEntity
    implements ServerOptionalRelations
{
    channels?: ChannelEntity[];
    members?: MemberEntity[];
    roles?: RoleEntity[];
}
