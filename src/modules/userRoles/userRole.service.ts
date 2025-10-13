import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/base/base.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserRoleWithRelationsEntity } from 'src/modules/userRoles/entity/userRoleWithRelations.entity';

@Injectable()
export class UserRoleService extends BaseService<
    'userRole',
    UserRoleWithRelationsEntity
> {
    constructor(prisma: PrismaService) {
        super(prisma, 'userRole');
    }
}
