import { Controller, Delete, Get, Param, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ChannelPermission } from 'src/modules/channel-role-permissions/decorators/channel-permission.decorator';
import { PermissionFlags } from 'src/modules/channel-role-permissions/guards/permissions.enum';
import { ChannelService } from 'src/modules/channels/channel.service';

@Controller()
export class ChannelController {
    constructor(private channelService: ChannelService) {}

    @Get('/access-able')
    async getChannelsByServerId(
        @Param('serverId') serverId: string,
        @Req() req: Request,
    ) {
        return await this.channelService.getListChannelAccessAble(
            serverId,
            req.user.id,
        );
    }

    @ChannelPermission(PermissionFlags.MANAGER)
    @Delete('/:channelId')
    async deleteChannel(@Param('channelId') id: string) {
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
