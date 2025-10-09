import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export function SortField(
    enumType?: object,
    options?: {
        description?: string;
        transform?: (value: unknown) => unknown;
    },
) {
    const decorators: PropertyDecorator[] = [
        Transform(({ value }) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            options?.transform ? options.transform(value) : value,
        ),
        IsOptional,
    ];

    if (enumType) {
        decorators.push(
            IsEnum(enumType, {
                message: `${Object.keys(enumType).join(', ')} not allowed`,
            }),
        );
    }

    return applyDecorators(...decorators);
}
