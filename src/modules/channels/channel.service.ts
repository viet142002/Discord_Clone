import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/base/base.service';
import { ChannelWithRelationsEntity } from 'src/modules/channels/entity/channelWithRelations.entity';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ChannelService extends BaseService<
    'channel',
    ChannelWithRelationsEntity
> {
    constructor(prisma: PrismaService) {
        super(prisma, 'channel');
    }
}
