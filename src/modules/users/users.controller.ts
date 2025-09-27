import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UsersService } from 'src/modules/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        return {
            message: 'User created successfully',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }
}
