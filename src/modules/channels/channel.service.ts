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

    async getListChannelAccessAble(serverId: string, userId: string) {
        return this.model.findMany({
            where: {
                serverId: serverId,
                OR: [
                    {
                        isPrivate: false,
                    },
                    {
                        isPrivate: true,
                        channelPermissions: {
                            some: {
                                canView: true,
                                role: {
                                    OR: [
                                        {
                                            isOwner: true,
                                        },
                                        {
                                            isOwner: false,
                                            users: {
                                                some: {
                                                    userId: userId,
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        },
                    },
                ],
            },
            include: {
                channelPermissions: {
                    omit: {
                        roleId: true,
                        channelId: true,
                    },
                    include: {
                        role: {
                            omit: {
                                serverId: true,
                            },
                            include: {
                                users: true,
                            },
                        },
                    },
                },
            },
            omit: {
                createdAt: true,
                updatedAt: true,
            },
        });
    }
}
