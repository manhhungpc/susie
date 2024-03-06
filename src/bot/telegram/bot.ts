import { appConfig } from "@bot_config/app";
import { cmd } from "@telegram_bot/commands/listCommand";
import { Bot, Context, session } from "grammy";
import { CronJob } from "cron";
import {
    type ConversationFlavor,
    conversations,
    createConversation,
} from "@grammyjs/conversations";
import { newUserConversation } from "@telegram_bot/commands/user/newUserConversation";
import { todayMoodConversation } from "@telegram_bot/commands/emotion/todayMoodConversation";
import axios from "axios";
import { User } from "@telegram_bot/interface/interface";

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
    // await askMoodDaily();

    bot.start();
    console.log("Bot started!");
}

async function askMoodDaily() {
    const users = await axios.get(`${appConfig.API_URL}/api/users`);
    const timeZones: string[] = [];
    users.data.data.map((user: User) => timeZones.push(user.time_zone));
    for (let timeZone of timeZones) {
        const job = CronJob.from({
            cronTime: `0 ${appConfig.CRON_HOUR} * * *`,
            onTick: function () {
                console.log("You will see this message every second");
            },
            // start: true,
            timeZone,
        });
        job.start();
    }
}
