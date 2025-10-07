import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_EMAIL' })
    loginId: string;

    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_PASSWORD' })
    password: string;

    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_DEVICE_INFO' })
    device: string;

    @IsOptional()
    @IsBoolean()
    remember: boolean;
}
