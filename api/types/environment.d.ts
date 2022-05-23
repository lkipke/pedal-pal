declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB_HOST: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_NAME: string;
            DB_PORT: string;
            NODE_DOCKER_PORT: string;
            CLIENT_ORIGIN: string;
            FORCE_DB_RESET: string;
        }
    }
}

export {};
