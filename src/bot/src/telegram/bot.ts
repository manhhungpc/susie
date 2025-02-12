import { appConfig } from "@bot_config/app";
import { cmd } from "@telegram_bot/commands/listCommand";
import { Bot, Context, session } from "grammy";
import { CronJob } from "cron";
import { type ConversationFlavor, conversations, createConversation } from "@grammyjs/conversations";
import { newUserConversation } from "@telegram_bot/commands/user/newUserConversation";
import { todayMoodConversation } from "@telegram_bot/commands/emotion/todayMoodConversation";
import axios from "axios";
import { NotifyUser, User } from "@telegram_bot/interface/interface";

const bot = new Bot<Context & ConversationFlavor>(appConfig.TELEGRAM_TOKEN);

export async function launchBot() {
    bot.use(session({ initial: () => ({}) }));
    bot.use(conversations());

    bot.use(createConversation(newUserConversation));
    bot.command(cmd.NEW_USER, async (ctx) => {
        await ctx.conversation.enter("newUserConversation");
    });

    bot.use(createConversation(todayMoodConversation));
    bot.command(cmd.TODAY_MOOD, async (ctx) => {
        await ctx.conversation.enter("todayMoodConversation");
    });
    await askMoodDaily();

    bot.start();
    console.log("Bot started!");
}

async function askMoodDaily() {
    const users = await axios.get(`${appConfig.API_URL}/api/users`);
    const notifyUsers: NotifyUser[] = [];

    users.data.data.map((user: User) =>
        notifyUsers.push({
            telegram_id: user.telegram.id,
            timezone: user.time_zone,
        }),
    );
    for (let user of notifyUsers) {
        const job = CronJob.from({
            cronTime: `56 ${appConfig.CRON_HOUR} * * *`,
            onTick: async function () {
                await bot.api.sendMessage(user.telegram_id, "How was your day? Use command /today to record your mood");
            },
            // start: true,
            // timeZone: user.timezone,
        });
        job.start();
    }
}
