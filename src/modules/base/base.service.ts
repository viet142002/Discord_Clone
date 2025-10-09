import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

type IInclude = string[];

@Injectable()
export abstract class BaseService<TModel extends PrismaModel, Entity> {
    protected readonly modelName: TModel;
    protected readonly model: ModelMethods<Entity, TModel>;
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

    async create(
        args: Prisma.Args<PrismaService[TModel], 'create'>,
    ): Promise<Entity> {
        return this.model.create(args);
    }

    async findUnique(
        args: Prisma.Args<PrismaService[TModel], 'findUnique'>,
    ): Promise<Entity | null> {
        return this.model.findUnique(args);
    }

    async findUniqueOrThrow(
        args: Prisma.Args<PrismaService[TModel], 'findUniqueOrThrow'>,
    ): Promise<Entity | null> {
        return this.model.findUniqueOrThrow(args);
    }

    async update(
        args: Prisma.Args<PrismaService[TModel], 'update'>,
    ): Promise<Entity> {
        return this.model.update(args);
    }

    async delete(
        args: Prisma.Args<PrismaService[TModel], 'delete'>,
    ): Promise<Entity> {
        return this.model.delete(args);
    }

    async findMany(options: {
        filter?: { search: string };
        searchFields?: (keyof TModel)[];
        pagination: PaginationDto;
        sort?: SortDto;
        include?: IInclude;
        where?: Prisma.Args<PrismaService[TModel], 'findMany'>['where'];
        omit?: Prisma.Args<PrismaService[TModel], 'findMany'>['omit'];
    }): Promise<PaginatedResponseDto<Entity>>;
    async findMany(options?: {
        filter?: { search: string };
        searchFields?: (keyof TModel)[];
        pagination?: PaginationDto;
        sort?: SortDto;
        include?: IInclude;
        where?: Prisma.Args<PrismaService[TModel], 'findMany'>['where'];
        omit?: Prisma.Args<PrismaService[TModel], 'findMany'>['omit'];
    }): Promise<Entity[]>;
    async findMany(options: {
        filter?: { search: string };
        searchFields?: (keyof TModel)[];
        pagination?: PaginationDto;
        sort?: SortDto;
        include?: IInclude;
        where?: Prisma.Args<PrismaService[TModel], 'findMany'>['where'];
        omit?: Prisma.Args<PrismaService[TModel], 'findMany'>['omit'];
    }): Promise<PaginatedResponseDto<Entity> | Entity[]> {
        const {
            filter,
            searchFields = ['title', 'description', 'content'],
            pagination = { page: 1, limit: 10 },
            sort,
            include,
            omit,
        } = options;

        const includeArr = formatUnknownToValidStringArray(include ?? []);
        const includeObj = formatStringArrayToObjectWithTrueValue(includeArr);

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
        >['where'] = {
            AND: [{ ...options.where }, searchCondition],
        } as Prisma.Args<PrismaService[TModel], 'findMany'>['where'];

        const findManyArgsExceptPagination: Omit<
            FindManyArgs<TModel>,
            'skip' | 'take'
        > = {
            where: finalWhere,
            orderBy,
            omit,
            include: includeObj,
        };

        if (!pagination) {
            return this.model.findMany(findManyArgsExceptPagination);
        }

        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const [total, data] = await Promise.all([
            this.model.count({
                where: finalWhere,
            }),
            this.model.findMany({
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
