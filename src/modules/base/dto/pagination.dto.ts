import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
    @Type(() => Number)
    @Transform(({ value }) => (value === '' ? 1 : Number(value) || 1))
    @Min(1)
    @IsInt()
    @IsOptional()
    page?: number;

    @Type(() => Number)
    @Transform(({ value }) => (value === '' ? 10 : Number(value) || 10))
    @Min(1)
    @IsInt()
    @IsOptional()
    limit?: number;
}

export class PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export class PaginatedResponseBaseDto {
    pagination: PaginationMeta;
}

export class PaginatedResponseDto<T> extends PaginatedResponseBaseDto {
    data: T[];
}
