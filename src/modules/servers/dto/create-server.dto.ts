import { IsNotEmpty } from 'class-validator';

export class CreateServerDto {
    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_SERVER_NAME' })
    name: string;

    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_SERVER_DESCRIPTION' })
    description: string;
}
