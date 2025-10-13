import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export enum IncludeOption {
    USER = 'user',
    SERVER = 'server',
}

export class QueriesMemberInServerDto {
    @IsOptional()
    @Transform(({ value }): string | string[] => {
        // chuyển "user,server" -> ["user", "server"]
        if (typeof value === 'string') {
            return value.split(',').map((v) => v.trim());
        }
        return value;
    })
    @IsEnum(IncludeOption, { each: true })
    include?: IncludeOption[];

    @IsOptional()
    @Transform(({ value }): string | string[] => {
        // chuyển "user,server" -> ["user", "server"]
        if (typeof value === 'string') {
            return value.split(',').map((v) => v.trim());
        }
        return value;
    })
    @IsEnum(IncludeOption, { each: true })
    select?: IncludeOption[];
}
