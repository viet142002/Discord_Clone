import { IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_USER_ID' })
    userId: string;

    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_PLATFORM_INFO' })
    platform: string;

    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_DEVICE_INFO' })
    device: string;
}
