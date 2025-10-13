import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/base/base.service';
import { JoinDto } from 'src/modules/members/dto/join.dto';
import { MemberWithRelationsEntity } from 'src/modules/members/entity/memberWithRelations.entity';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserRoleService } from 'src/modules/userRoles/userRole.service';

@Injectable()
export class MemberService extends BaseService<
    'member',
    MemberWithRelationsEntity
> {
    protected override includeMap = {
        user: { omit: { password: true } },
        server: true,
    };
    constructor(
        prisma: PrismaService,
        private userRoleService: UserRoleService,
    ) {
        super(prisma, 'member');
    }

    async join(joinDto: JoinDto & { userId: string }) {
        await this.prisma.member.findMany({
            where: {
                serverId: joinDto.serverId,
            },
            include: {
                user: { omit: { password: true } },
            },
        });

        const joined = await this.findUnique({
            where: {
                userId_serverId: {
                    userId: joinDto.userId,
                    serverId: joinDto.serverId,
                },
            },
        });

        if (joined) {
            throw new BadRequestException('USER_ALREADY_JOINED');
        }

        await this.prisma.$transaction(async (tx) => {
            await this.create(
                {
                    data: {
                        userId: joinDto.userId,
                        serverId: joinDto.serverId,
                    },
                },
                tx,
            );
            await this.userRoleService.create({
                data: {
                    roleId: joinDto.roleId,
                    userId: joinDto.userId,
                },
            });
        });

        return {};
    }
}
