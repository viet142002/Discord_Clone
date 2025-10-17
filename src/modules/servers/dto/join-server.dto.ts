import { IsNotEmpty } from 'class-validator';

export class JoinServerDto {
    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_ROLE' })
    role: string;
}
