import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/modules/base/base.service';
import { MessageWithRelationsEntity } from './entity/messageWithRelation.entity';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { QueriesMessageInChannelDto } from 'src/modules/messages/dto/queriesMessageInChannel.dto';
import { SendMessageDto } from 'src/modules/messages/dto/sendMessage.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MessageService extends BaseService<
    'message',
    MessageWithRelationsEntity
> {
    protected override includeMap: Prisma.Args<
        PrismaService['message'],
        'findMany'
    >['include'] = {
        sender: {
            select: { id: true, name: true },
        },
        mentions: {
            select: {
                id: true,
                user: { select: { id: true, name: true } },
                type: true,
            },
        },
        replies: {
            select: {
                id: true,
                content: true,
                sender: { select: { id: true, name: true } },
            },
        },
    };
    constructor(prisma: PrismaService) {
        super(prisma, 'message');
    }

    async getMessagesByChannelId(
        channelId: string,
        queries: QueriesMessageInChannelDto,
    ) {
        return this.findMany({
            where: { channelId },
            searchFields: ['content'],
            filter: queries.search
                ? {
                      search: queries.search,
                  }
                : undefined,
            include: ['mentions', 'replyTo', 'sender'],
            pagination: {
                page: queries.page || 1,
                limit: queries.limit || 10,
            },
            omit: {
                senderId: true,
                channelId: true,
                replyToId: true,
            },
            sort: { sortBy: 'createdAt', sortDirection: 'desc' },
        });
    }

    async sendMessage(userId: string, messageDto: SendMessageDto) {
        const mentions:
            | Prisma.MentionUncheckedCreateNestedManyWithoutMessageInput
            | undefined =
            messageDto.mentions && messageDto.mentions?.length > 0
                ? {
                      createMany: {
                          data: messageDto.mentions.map((mention) => ({
                              type: mention === 'all' ? 'ALL' : 'USER',
                              userId: mention === 'all' ? null : mention,
                          })),
                      },
                  }
                : undefined;
        return this.create({
            data: {
                content: messageDto.content,
                channelId: messageDto.channelId,
                replyToId: messageDto.replyToId,
                senderId: userId,
                mentions,
            },
        });
    }
}
