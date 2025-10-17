import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { QueriesMessageInChannelDto } from 'src/modules/messages/dto/queriesMessageInChannel.dto';
import { SendMessageDto } from 'src/modules/messages/dto/sendMessage.dto';
import { MessageService } from 'src/modules/messages/message.service';

@Controller()
export class MessageController {
    constructor(private messageService: MessageService) {}

    @Get()
    async getMessagesByChannelId(
        @Param('channelId') channelId: string,
        @Param('serverId') serverId: string,
        @Query() queries: QueriesMessageInChannelDto,
    ) {
        return this.messageService.getMessagesByChannelId(channelId, {
            page: queries.page || 1,
            limit: queries.limit || 10,
            search: queries.search,
        });
    }

    @Post()
    async sendMessage(
        @Param('channelId') channelId: string,
        @Param('serverId') serverId: string,
        @Req() req: Request,
        @Body() messageDto: SendMessageDto,
    ) {
        const userId = req.user.id;
        await this.messageService.sendMessage(userId, channelId, messageDto);
        return {
            message: 'SEND_MESSAGE_SUCCESSFULLY',
        };
    }

    @Delete(':id')
    async deleteMessage(@Param('id') messageId: string) {
        await this.messageService.delete({
            where: {
                id: messageId,
            },
        });
        return {
            message: 'DELETE_MESSAGE_SUCCESSFULLY',
        };
    }
}
