import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto';

@Controller('users')
export class UsersController {
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto);
        return 'This action adds a new user';
    }
}
