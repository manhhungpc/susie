import { appConfig } from "src/config/app";
import { cmd } from "src/telegram_bot/commands/listCommand";
import { Bot, Context, session } from "grammy";
import {
    type ConversationFlavor,
    conversations,
    createConversation,
} from "@grammyjs/conversations";
import { newUserConversation } from "@telegram/commands/user/newUserConversation";
import { todayMoodConversation } from "@telegram/commands/emotion/todayMoodConversation";

const bot = new Bot<Context & ConversationFlavor>(appConfig.TELEGRAM_TOKEN);

export function launchBot() {
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

    bot.start();
    console.log("Bot started!");
}

// export default bot;
