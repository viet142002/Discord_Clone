import { BadRequestException, Injectable } from '@nestjs/common';

import { BaseService } from 'src/modules/base/base.service';
import { ServerWithRelationsEntity } from 'src/modules/servers/entity/serverWithRelations.entity';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { JoinServerDto } from 'src/modules/servers/dto/joinServer.dto';
import { CreateServerDto } from 'src/modules/servers/dto/createServer.dto';
import { MemberService } from 'src/modules/members/member.service';
import { RoleService } from 'src/modules/roles/role.service';
import { ChannelService } from 'src/modules/channels/channel.service';

@Injectable()
export class ServersService extends BaseService<
    'server',
    ServerWithRelationsEntity
> {
    constructor(
        prisma: PrismaService,
        private memberService: MemberService,
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

    async joinServer(
        data: JoinServerDto & { userId: string; serverId: string },
    ): Promise<void> {
        const joined = await this.memberService.findUnique({
            where: {
                userId_serverId: {
                    userId: data.userId,
                    serverId: data.serverId,
                },
            },
        });

        if (joined) {
            throw new BadRequestException('USER_ALREADY_JOINED');
        }

        return this.prisma.$transaction(async (tx) => {
            await this.memberService.create(
                {
                    data: {
                        userId: data.userId,
                        serverId: data.serverId,
                    },
                },
                tx,
            );

            await this.roleService.update({
                where: {
                    id: data.role,
                },
                data: {
                    users: {
                        create: {
                            userId: data.userId,
                        },
                    },
                },
            });
        });
    }
}
