import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/base/base.service';
import { ChannelRolePermissionWithRelationsEntity } from 'src/modules/channelRolePermissions/entity/channelRolePermissionWithRelations.entity';
import { PermissionFlags } from 'src/modules/channelRolePermissions/guards/permissions.enum';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ChannelRolePermissionsService extends BaseService<
    'channelRolePermission',
    ChannelRolePermissionWithRelationsEntity
> {
    constructor(prisma: PrismaService) {
        super(prisma, 'channelRolePermission');
    }

    async findPermissionsByChannelIdAndUserId(
        channelId: string,
        userId: string,
        reqPermission: PermissionFlags,
    ) {
        const perm = {
            [reqPermission]: true,
        };
        const hasPermission = await this.prisma.channelRolePermission.findFirst(
            {
                where: {
                    channelId: channelId,
                    role: {
                        users: {
                            some: {
                                id: userId,
                            },
                        },
                    },
                    ...perm,
                },
            },
        );
        if (!hasPermission) return false;

        return hasPermission;
    }
}
