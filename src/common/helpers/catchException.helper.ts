import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handlePrismaDeleteError(
    error: any,
    entityName: string,
    id: string,
) {
    if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
    ) {
        throw new NotFoundException(`${entityName} with id "${id}" not found`);
    }
    throw error;
}
