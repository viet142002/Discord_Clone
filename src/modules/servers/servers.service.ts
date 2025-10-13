import { Injectable } from '@nestjs/common';

import { BaseService } from 'src/modules/base/base.service';
import { ServerWithRelationsEntity } from 'src/modules/servers/entity/serverWithRelations.entity';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateServerDto } from 'src/modules/servers/dto/createServer.dto';
import { RoleService } from 'src/modules/roles/role.service';
import { ChannelService } from 'src/modules/channels/channel.service';

@Injectable()
export class ServersService extends BaseService<
    'server',
    ServerWithRelationsEntity
> {
    constructor(
        prisma: PrismaService,
        private roleService: RoleService,
        private channelService: ChannelService,
    ) {
        super(prisma, 'server');
    }

    async createServer(
        data: CreateServerDto & { userId: string },
    ): Promise<ServerWithRelationsEntity> {
        return this.prisma.$transaction(async (tx) => {
            const serverCreated = await this.create(
                {
                    data: {
                        name: data.name,
                        description: data.description,
                        iconUrl: '',
                        members: {
                            create: {
                                userId: data.userId,
                            },
                        },
                        roles: {
                            create: {
                                name: 'Owner',
                                isOwner: true,
                                users: {
                                    create: {
                                        userId: data.userId,
                                    },
                                },
                            },
                        },
                    },
                },
                tx,
            );

            const memberRole = await this.roleService.create(
                {
                    data: {
                        name: 'member',
                        server: {
                            connect: {
                                id: serverCreated.id,
                            },
                        },
                    },
                },
                tx,
            );

            await this.channelService.create(
                {
                    data: {
                        name: 'general',
                        server: {
                            connect: {
                                id: serverCreated.id,
                            },
                        },
                        channelPermissions: {
                            create: {
                                roleId: memberRole.id,
                            },
                        },
                    },
                },
                tx,
            );

            return serverCreated;
        });
    }
}
