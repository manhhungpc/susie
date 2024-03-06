import { type Conversation, type ConversationFlavor } from "@grammyjs/conversations";
import { Context, Keyboard, SessionFlavor } from "grammy";
import { appConfig } from "@bot_config/app";
import axios from "axios";
import { type ResponseAPI } from "@telegram_bot/interface/interface";
import { Mood } from "@bot_config/enum";

type TodayMoodContext = Context & ConversationFlavor;
type TodayMoodConversation = Conversation<TodayMoodContext>;

export async function todayMoodConversation(
    conversation: TodayMoodConversation,
    ctx: TodayMoodContext,
) {
    const moodArgs = ctx.match;
    if (moodArgs) {
        const response = await updateTodayMood(Number(moodArgs), String(ctx.from?.id));
        await ctx.reply(response);
        return;
    }
    await ctx.reply(`Enter a number represent your today mood:
    TIRED = -1,
    SICK = -1,
    WORST_DAY_EVER = 0,
    AWFUL = 1,
    TERRIBLE = 1,
    SAD = 2,
    WORSE_THAN_AVERAGE = 2,
    STRESSED = 3,
    ANXIOUS = 3,
    AVERAGE = 4,
    OKAY = 4,
    HAPPY = 5,
    BETTER_THAN_AVERAGE = 5,
    AMAZING = 6,
    WONDERFUL = 6,`);

    const mood = await conversation.waitFor(":text");
    if (Object.values(Mood).includes(Number(mood.message?.text)) == false) {
        await ctx.reply("Invalid mood argument");
        return;
    }

    const response = await updateTodayMood(Number(mood), String(ctx.from?.id));
    await ctx.reply(response);

    return;
}

const updateTodayMood = async (mood: number, user: string) => {
    const body = {
        source: "telegram",
        user: user,
        mood: mood,
    };
    try {
        const response = await axios.post(`${appConfig.API_URL}/api/emotion/today`, body, {
            headers: {
                //TODO: Add jwt
            },
        });
        if (response.data.success == false) {
            return response.data.message ?? "Something wrong!";
        }
    } catch (err) {
        return "Something wrong";
    }
    return "Recorded";
};
