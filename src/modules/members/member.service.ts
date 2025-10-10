import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/base/base.service';
import { MemberWithRelationsEntity } from 'src/modules/members/entity/memberWithRelations.entity';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class MemberService extends BaseService<
    'member',
    MemberWithRelationsEntity
> {
    constructor(prisma: PrismaService) {
        super(prisma, 'member');
    }
}
