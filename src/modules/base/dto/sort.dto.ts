import { Prisma } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { SortField } from 'src/modules/base/decorator/sort-field.decorator';

const DEFAULT_SORT_ORDER = Prisma.SortOrder.desc;

export class SortDto {
    @SortField()
    sortBy?: string;

    @Transform(
        ({ value }: { value: Prisma.SortOrder | null }): Prisma.SortOrder =>
            value ?? DEFAULT_SORT_ORDER,
    )
    @IsEnum(Prisma.SortOrder, {
        message: 'VALIDATION_INVALID_SORT_DIRECTION',
    })
    sortDirection?: Prisma.SortOrder = DEFAULT_SORT_ORDER;
}
