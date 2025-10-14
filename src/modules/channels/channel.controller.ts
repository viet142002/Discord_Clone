import { Controller, Delete, Get } from '@nestjs/common';
import { ChannelService } from 'src/modules/channels/channel.service';

@Controller('channels')
export class ChannelController {
    constructor(private channelService: ChannelService) {}

    @Get('/:serverId')
    async getChannelsByServerId(serverId: string) {
        return await this.channelService.findMany({
            where: {
                serverId,
            },
        });
    }

    @Delete('/:id')
    async deleteChannel(id: string) {
        await this.channelService.delete({
            where: {
                id,
            },
        });
        return {
            message: 'DELETE_CHANNEL_SUCCESSFULLY',
        };
    }
}
