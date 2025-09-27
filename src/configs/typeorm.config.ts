import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = async (
    configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
    const configDatabase = configService.get('database') as Record<
        string,
        string
    >;
    return {
        type: 'postgres',
        host: configDatabase.host,
        port: +configDatabase.port,
        username: configDatabase.username,
        password: configDatabase.password,
        database: configDatabase.database,
        autoLoadEntities: true,
        synchronize: true,
    };
};
