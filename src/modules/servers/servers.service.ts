import { Injectable } from '@nestjs/common';

import { BaseService } from 'src/modules/base/base.service';
import { ServerWithRelationsEntity } from 'src/modules/servers/entity/serverWithRelations.entity';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ServersService extends BaseService<
    'server',
    ServerWithRelationsEntity
> {
    constructor(prisma: PrismaService) {
        super(prisma, 'server');
    }
}
