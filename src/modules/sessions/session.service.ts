import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/base/base.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { SessionWithRelationsEntity } from 'src/modules/sessions/entity/session-with-relations.entity';

@Injectable()
export class SessionService extends BaseService<
    'session',
    SessionWithRelationsEntity
> {
    constructor(prisma: PrismaService) {
        super(prisma, 'session');
    }
}
