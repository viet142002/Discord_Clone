import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/base/base.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { RoleWithRelationsEntity } from 'src/modules/roles/entity/role-with-relation.entity';

@Injectable()
export class RoleService extends BaseService<'role', RoleWithRelationsEntity> {
    constructor(prisma: PrismaService) {
        super(prisma, 'role');
    }
}
