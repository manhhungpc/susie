import { config } from "dotenv";
config();

function env(key: string, value?: any): string {
    return process.env[key] ?? value;
}

export const appConfig = {
    TELEGRAM_TOKEN: env("TELEGRAM_TOKEN"),
    CRON_HOUR: env("CRON_HOUR", 22),
    API_URL: env("API_URL"),
    BOT_KEY: env("BOT_KEY"),
};
