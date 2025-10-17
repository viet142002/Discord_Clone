import { IsNotEmpty, IsOptional } from 'class-validator';

export class SendMessageDto {
    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_CONTENT' })
    content: string;

    @IsOptional()
    mentions?: string[];

    @IsOptional()
    replyToId?: string;
}
