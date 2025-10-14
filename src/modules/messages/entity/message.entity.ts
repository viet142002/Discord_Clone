import { Message } from '@prisma/client';

export class MessageEntity implements Message {
    id: string;
    content: string;
    senderId: string;
    replyToId: string | null;
    channelId: string;
    createdAt: Date;

    constructor(partial: Partial<MessageEntity>) {
        Object.assign(this, partial);
    }
}
