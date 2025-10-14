import { Channel, Mention, Prisma, User, Message } from '@prisma/client';

import { MessageEntity } from './message.entity';

type MessageOptionalRelations = Partial<
    Prisma.MessageGetPayload<{
        include: {
            channel: true;
            mentions: true;
            replies: { include: { sender: { omit: { password: true } } } };
            replyTo: { include: { sender: { omit: { password: true } } } };
            sender: { omit: { password: true } };
        };
    }>
>;

interface IReplyMessage extends Message {
    id: string;
    content: string;
    sender: Omit<User, 'password'>;
}

export class MessageWithRelationsEntity
    extends MessageEntity
    implements MessageOptionalRelations
{
    sender?: Omit<User, 'password'>;
    channel?: Channel;
    mentions?: Mention[];
    replies?: IReplyMessage[];
    replyTo?: IReplyMessage;
}
