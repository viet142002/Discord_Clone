import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from 'src/modules/users/dto';
import { hashPassword } from 'src/common/helpers/bcrypt.helper';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashPass = await hashPassword(createUserDto.password);
        return await this.userRepo.save({
            ...createUserDto,
            password: hashPass,
        });
    }

    async findById(id: number): Promise<User | null> {
        return await this.userRepo.findOneBy({ id });
    }

    async findOne(loginId: string): Promise<User | null> {
        return await this.userRepo.findOneBy([
            { username: loginId },
            { email: loginId },
        ]);
    }

    async findOneQueries(
        queries: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    ): Promise<User | null> {
        return await this.userRepo.findOne({
            where: queries,
        });
    }
}
