import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_NAME' })
    name: string;

    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_ROLE' })
    role: string;

    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_USERNAME' })
    username: string;

    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_EMAIL' })
    @IsEmail(undefined, { message: 'VALIDATION_INVALID_EMAIL' })
    email: string;

    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_PASSWORD' })
    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        { message: 'VALIDATION_INVALID_PASSWORD' },
    )
    password: string;
}
