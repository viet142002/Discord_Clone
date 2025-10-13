import { IsNotEmpty } from 'class-validator';

export class JoinDto {
    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_SERVER' })
    serverId: string;

    @IsNotEmpty({ message: 'VALIDATION_REQUIRED_ROLE' })
    roleId: string;
}
