import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import {
    formatStringArrayToObjectWithTrueValue,
    formatUnknownToValidStringArray,
} from 'src/common/helpers';
import {
    PaginatedResponseDto,
    PaginationDto,
} from 'src/modules/base/dto/pagination.dto';
import { SortDto } from 'src/modules/base/dto/sort.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

type PrismaModel = keyof {
    [K in keyof PrismaService as PrismaService[K] extends {
        create: unknown;
    }
        ? K
        : never]: unknown;
};

type FindManyArgs<TModel extends PrismaModel> = {
    where?: Prisma.Args<PrismaService[TModel], 'findMany'>['where'];
    include?: Prisma.Args<PrismaService[TModel], 'findMany'>['include'];
    omit?: Prisma.Args<PrismaService[TModel], 'findMany'>['omit'];
    select?: Prisma.Args<PrismaService[TModel], 'findMany'>['select'];
    orderBy?: Prisma.Args<PrismaService[TModel], 'findMany'>['orderBy'];
    skip?: number;
    take?: number;
};

type ModelMethods<Entity, TModel extends PrismaModel> = {
    create: (args: {
        data?: Prisma.Args<PrismaService[TModel], 'create'>['data'];
        include?: Prisma.Args<PrismaService[TModel], 'create'>['include'];
        select?: Prisma.Args<PrismaService[TModel], 'create'>['select'];
        omit?: Prisma.Args<PrismaService[TModel], 'create'>['omit'];
    }) => Promise<Entity>;
    findUnique: (args: {
        where: Prisma.Args<PrismaService[TModel], 'findUnique'>['where'];
        include?: Prisma.Args<PrismaService[TModel], 'findUnique'>['include'];
        select?: Prisma.Args<PrismaService[TModel], 'findUnique'>['select'];
        omit?: Prisma.Args<PrismaService[TModel], 'findUnique'>['omit'];
    }) => Promise<Entity | null>;
    findUniqueOrThrow: (args: {
        where: Prisma.Args<PrismaService[TModel], 'findUniqueOrThrow'>['where'];
        include?: Prisma.Args<
            PrismaService[TModel],
            'findUniqueOrThrow'
        >['include'];
        select?: Prisma.Args<
            PrismaService[TModel],
            'findUniqueOrThrow'
        >['select'];
        omit?: Prisma.Args<PrismaService[TModel], 'findUniqueOrThrow'>['omit'];
    }) => Promise<Entity | null>;
    update: (args: {
        data: Prisma.Args<PrismaService[TModel], 'update'>['data'];
        where: Prisma.Args<PrismaService[TModel], 'update'>['where'];
        include?: Prisma.Args<PrismaService[TModel], 'update'>['include'];
        omit?: Prisma.Args<PrismaService[TModel], 'update'>['omit'];
        select?: Prisma.Args<PrismaService[TModel], 'update'>['select'];
    }) => Promise<Entity>;
    delete: (args: {
        where: Prisma.Args<PrismaService[TModel], 'delete'>['where'];
        include?: Prisma.Args<PrismaService[TModel], 'delete'>['include'];
        omit?: Prisma.Args<PrismaService[TModel], 'delete'>['omit'];
        select?: Prisma.Args<PrismaService[TModel], 'delete'>['select'];
    }) => Promise<Entity>;
    findMany: (args: FindManyArgs<TModel>) => Promise<Entity[]>;
    count: (args: {
        where?: Prisma.Args<PrismaService[TModel], 'count'>['where'];
    }) => Promise<number>;
};

type IInclude = string[] | string;

export type TransactionClient = Omit<
    PrismaClient<Prisma.PrismaClientOptions>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'
>;

@Injectable()
export abstract class BaseService<TModel extends PrismaModel, Entity> {
    protected readonly modelName: TModel;
    protected readonly model: ModelMethods<Entity, TModel>;
    protected includeMap: Prisma.Args<
        PrismaService[TModel],
        'findMany'
    >['include'] = {};
    constructor(
        protected readonly prisma: PrismaService,
        modelName: TModel,
    ) {
        this.modelName = modelName;
        this.model = this.prisma[this.modelName] as unknown as ModelMethods<
            Entity,
            TModel
        >;
    }

    getClient(ts?: TransactionClient): ModelMethods<Entity, TModel> {
        if (!ts) return this.model;
        return ts[this.modelName] as unknown as ModelMethods<Entity, TModel>;
    }

    async create(
        args: Prisma.Args<PrismaService[TModel], 'create'>,
        tx?: TransactionClient,
    ): Promise<Entity> {
        return this.getClient(tx).create(args);
    }

    async findUnique(
        args: Prisma.Args<PrismaService[TModel], 'findUnique'>,
        tx?: TransactionClient,
    ): Promise<Entity | null> {
        return this.getClient(tx).findUnique(args);
    }

    async findUniqueOrThrow(
        args: Prisma.Args<PrismaService[TModel], 'findUniqueOrThrow'>,
        tx?: TransactionClient,
    ): Promise<Entity | null> {
        return this.getClient(tx).findUniqueOrThrow(args);
    }

    async update(
        args: Prisma.Args<PrismaService[TModel], 'update'>,
        tx?: TransactionClient,
    ): Promise<Entity> {
        return this.getClient(tx).update(args);
    }

    async delete(
        args: Prisma.Args<PrismaService[TModel], 'delete'>,
        tx?: TransactionClient,
    ): Promise<Entity> {
        return this.getClient(tx).delete(args);
    }

    async findMany(
        options: {
            select?: Prisma.Args<PrismaService[TModel], 'findMany'>['select'];
            filter?: { search: string };
            searchFields?: (keyof Entity)[];
            pagination: PaginationDto;
            sort?: SortDto;
            include?: IInclude;
            where?: Prisma.Args<PrismaService[TModel], 'findMany'>['where'];
            omit?: Prisma.Args<PrismaService[TModel], 'findMany'>['omit'];
        },
        tx?: TransactionClient,
    ): Promise<PaginatedResponseDto<Entity>>;
    async findMany(
        options?: {
            select?: Prisma.Args<PrismaService[TModel], 'findMany'>['select'];
            filter?: { search: string };
            searchFields?: (keyof Entity)[];
            pagination?: PaginationDto;
            sort?: SortDto;
            include?: IInclude;
            where?: Prisma.Args<PrismaService[TModel], 'findMany'>['where'];
            omit?: Prisma.Args<PrismaService[TModel], 'findMany'>['omit'];
        },
        tx?: TransactionClient,
    ): Promise<Entity[]>;
    async findMany(
        options: {
            select?: Prisma.Args<PrismaService[TModel], 'findMany'>['select'];
            filter?: { search: string };
            searchFields?: (keyof Entity)[];
            pagination?: PaginationDto;
            sort?: SortDto;
            include?: IInclude;
            where?: Prisma.Args<PrismaService[TModel], 'findMany'>['where'];
            omit?: Prisma.Args<PrismaService[TModel], 'findMany'>['omit'];
        },
        tx?: TransactionClient,
    ): Promise<PaginatedResponseDto<Entity> | Entity[]> {
        const {
            select,
            filter,
            searchFields = ['title', 'description', 'content'],
            pagination = { page: 1, limit: 10 },
            sort,
            include,
            omit,
        } = options;

        const includeArr = formatUnknownToValidStringArray(include ?? []);
        const includeObj = formatStringArrayToObjectWithTrueValue(includeArr);

        for (const key of Object.keys(includeObj)) {
            if (this.includeMap && this.includeMap[key]) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                includeObj[key] = this.includeMap[key];
            }
        }

        const orderBy = (sort?.sortBy && {
            [sort.sortBy]: sort.sortDirection,
        }) as Prisma.Args<PrismaService[TModel], 'findMany'>['orderBy'];

        const searchCondition = filter && {
            OR: searchFields.map((field) => ({
                [field]: {
                    contains: filter?.search,
                    mode: 'insensitive',
                },
            })),
        };

        const finalWhere: Prisma.Args<
            PrismaService[TModel],
            'findMany'
        >['where'] = (
            searchCondition
                ? {
                      AND: [{ ...options.where }, searchCondition],
                  }
                : options.where
        ) as Prisma.Args<PrismaService[TModel], 'findMany'>['where'];

        const findManyArgsExceptPagination: Omit<
            FindManyArgs<TModel>,
            'skip' | 'take'
        > = {
            where: finalWhere,
            orderBy,
            omit,
            include: includeObj,
            select,
        };

        const client = this.getClient(tx);

        if (!pagination) {
            return this.model.findMany(findManyArgsExceptPagination);
        }

        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const [total, data] = await Promise.all([
            client.count({
                where: finalWhere,
            }),
            client.findMany({
                ...findManyArgsExceptPagination,
                skip,
                take: limit,
            }),
        ]);

        return {
            data,
            pagination: {
                page,
                total,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
