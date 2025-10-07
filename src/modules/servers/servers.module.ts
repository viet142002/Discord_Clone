import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { Server } from './server.entity';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Server]), UsersModule],
    controllers: [ServersController],
    providers: [ServersService],
    exports: [ServersService],
})
export class ServersModule {}
