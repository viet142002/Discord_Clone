import { Prisma } from '@prisma/client';

import { ChannelEntity } from './channel.entity';
import { ServerEntity } from 'src/modules/servers/entity/server.entity';

type ChannelOptionalRelations = Partial<
    Prisma.ChannelGetPayload<{
        include: {
            channelPermissions: true;
            server: true;
        };
        select: {
            channelPermissions: true;
            server: true;
        };
    }>
>;

export class ChannelWithRelationsEntity
    extends ChannelEntity
    implements ChannelOptionalRelations
{
    server?: ServerEntity;
}
