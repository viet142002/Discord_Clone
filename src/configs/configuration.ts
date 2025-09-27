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
    JWT_ACCESS_ACCESS_KEY: process.env.JWT_ACCESS_ACCESS_KEY,
    JWT_ACCESS_EXPIRATION_TIME: process.env.JWT_ACCESS_EXPIRATION_TIME,
    JWT_SECRET_REFRESH_KEY: process.env.JWT_SECRET_REFRESH_KEY,
    JWT_REFRESH_EXPIRATION_TIME: process.env.JWT_REFRESH_EXPIRATION_TIME,
});
