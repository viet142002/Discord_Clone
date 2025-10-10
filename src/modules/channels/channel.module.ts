import { Module } from '@nestjs/common';
import { ChannelService } from 'src/modules/channels/channel.service';

@Module({
    imports: [],
    controllers: [],
    providers: [ChannelService],
    exports: [ChannelService],
})
export class ChannelModule {}
