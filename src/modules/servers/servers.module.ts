import { Module } from '@nestjs/common';

import { ServersController } from './servers.controller';
import { ServersService } from './servers.service';
import { MemberModule } from 'src/modules/members/member.module';
import { ChannelModule } from 'src/modules/channels/channel.module';
import { RoleModule } from 'src/modules/roles/role.module';

@Module({
    imports: [MemberModule, ChannelModule, RoleModule],
    controllers: [ServersController],
    providers: [ServersService],
    exports: [ServersService],
})
export class ServersModule {}
