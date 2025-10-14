import { Module } from '@nestjs/common';
import { ChannelController } from 'src/modules/channels/channel.controller';
import { ChannelService } from 'src/modules/channels/channel.service';

@Module({
    imports: [],
    controllers: [ChannelController],
    providers: [ChannelService],
    exports: [ChannelService],
})
export class ChannelModule {}
