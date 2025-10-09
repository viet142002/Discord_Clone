import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { hashPassword } from 'src/common/helpers/bcrypt.helper';
import { BaseService } from 'src/modules/base/base.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserWithRelationsEntity } from 'src/modules/users/entity/userWithRelations.entity';

@Injectable()
export class UsersService extends BaseService<'user', UserWithRelationsEntity> {
    constructor(prisma: PrismaService) {
        super(prisma, 'user');
    }

    async createUser(
        data: Prisma.UserCreateInput,
    ): Promise<Omit<User, 'password'>> {
        const hashPass = await hashPassword(data.password);
        const baseResult = await super.create({
            data: {
                ...data,
                password: hashPass,
            },
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userCreated } = baseResult;

        return userCreated;
    }
}
