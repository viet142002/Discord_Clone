import { Module } from '@nestjs/common';
import { MessageController } from 'src/modules/messages/message.controller';
import { MessageService } from 'src/modules/messages/message.service';

@Module({
    controllers: [MessageController],
    providers: [MessageService],
    exports: [],
})
export class MessageModule {}
