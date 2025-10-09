import { Channel } from '@prisma/client';

enum ChannelType {
    TEXT = 'TEXT',
    VOICE = 'VOICE',
}

export class ChannelEntity implements Channel {
    id: string;
    serverId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    type: ChannelType;
    isPrivate: boolean;

    constructor(partial: Partial<ChannelEntity>) {
        Object.assign(this, partial);
    }
}
