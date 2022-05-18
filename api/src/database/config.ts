// Requires each of these values to be defined in the appropriate env file
export default {
    HOST: process.env.DB_HOST!,
    USER: process.env.DB_USER!,
    PASSWORD: process.env.DB_PASSWORD!,
    DB: process.env.DB_NAME!,
    port: process.env.DB_PORT!,
    dialect: 'mysql' as const,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
