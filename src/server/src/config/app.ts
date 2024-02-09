import { config } from "dotenv";
config();

function env(key: string, defaultValue?: any | null): string {
    return process.env[key] ?? defaultValue;
}

export const serverConfig = {
    PORT: env("PORT"),
    SECRET_KEY: env("SECRET_KEY"),
    BOT_KEY: env("BOT_KEY"),
    NODE_ENV: env("NODE_ENV"),

    MONGO_PATH: env("MONGO_PATH"),
    CREDENTIALS: env("CREDENTIALS", true),
    ORIGIN: env("ORIGIN"),

    formatDatetime: env("FORMAT_DATETIME", "YYYY-MM-DD HH:mm:ss"),
    timezone: env("APP_TIMEZONE", "Asia/Ho_Chi_Minh"),

    controllersDir: env("CONTROLLERS_DIR"),
    middlewaresDir: env("MIDDLEWARES_DIR"),
    routePrefix: env("APP_ROUTE_PREFIX"),
    logDir: env("LOG_DIR"),
};

export const apiConfig = {
    perPage: 10,
};

export * from "./db";
