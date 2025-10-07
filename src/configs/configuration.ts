export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        driver: process.env.DATABASE_DRIVER,
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
    JWT_ACCESS_ACCESS_KEY: process.env.JWT_ACCESS_ACCESS_KEY,
    JWT_ACCESS_EXPIRATION_TIME: 1000 * 60 * 15,
    JWT_SECRET_REFRESH_KEY: process.env.JWT_SECRET_REFRESH_KEY,
    JWT_REFRESH_EXPIRATION_TIME: 1000 * 60 * 60 * 24 * 7,
});
