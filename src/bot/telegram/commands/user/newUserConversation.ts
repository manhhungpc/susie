import { type Conversation, type ConversationFlavor } from "@grammyjs/conversations";
import { Context, Keyboard, SessionFlavor } from "grammy";
import { appConfig } from "@bot_config/app";
import axios from "axios";
import { type ResponseAPI } from "src/bot/telegram/interface/interface";

interface Body {
    name: string;
    username: string | null;
    phone_number: string | null;
    telegram: {
        id: string;
        username: string | null;
    };
}

type NewUserContext = Context & ConversationFlavor;
type NewUserConversation = Conversation<NewUserContext>;

export async function newUserConversation(conversation: NewUserConversation, ctx: NewUserContext) {
    const body: Body = {
        name: "",
        username: null,
        phone_number: null,
        telegram: {
            id: "",
            username: "",
        },
    };

    await ctx.reply("Welcome my friend! What should I call you?");
    const name = await conversation.form.text();
    body.name = name;
    body.telegram = {
        id: String(ctx.from?.id),
        username: ctx.from?.username ?? null,
    };

    if (body.telegram.username) {
        await ctx.reply(
            `*Optional*: Hey, seems like you don't have username\\!\n\nDo you want to set a custom username? \\(It's only for this app, not Telegram's username\\)`,
            {
                parse_mode: "MarkdownV2",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Yes, using custom username", callback_data: "custom_username" }],
                        [{ text: "Yes, using my phone number", callback_data: "get_phone_number" }],
                        [{ text: "Nope", callback_data: "ignore" }],
                    ],
                },
            },
        );

        const response = await conversation.waitForCallbackQuery([
            "get_phone_number",
            "custom_username",
            "ignore",
        ]);
        if (response.match === "get_phone_number") {
            await ctx.reply(
                "Allow me to get your phone number? \nIf you don't see it, it's the keyboard icon at left input text",
                {
                    reply_markup: {
                        resize_keyboard: true,
                        force_reply: true,
                        one_time_keyboard: true,
                        keyboard: [[{ text: "Send phone number 📱", request_contact: true }]],
                    },
                },
            );

            await conversation.waitUntil(async (ctx) => {
                if (ctx.has(":contact")) {
                    body.phone_number = String(ctx.message?.contact?.phone_number);
                    return true;
                }
                if (ctx.has(":text")) {
                    if (ctx.message?.text == "/username") {
                        const text = await conversation.waitFor(":text");
                        body.username = setCustomUsername(String(text.message?.text));
                        return true;
                    }
                    if (ctx.message?.text == "/nope") {
                        return true;
                    }
                    await ctx.reply(
                        `I need permission to use your phone number\\! Or:\\- Type \`/username\` to set custom username\\- Type \`/nope\` to cancel`,
                        { parse_mode: "MarkdownV2" },
                    );
                }
                return false;
            });
        }
        if (response.match === "custom_username") {
            await ctx.reply("Got it! Send me username you want");
            const text = await conversation.waitFor(":text");
            body.username = setCustomUsername(String(text.message?.text));
        }
    }
    const newUserResponse = await createUser(body);

    if (newUserResponse.status == 200 && newUserResponse.success == true) {
        await ctx.reply("Done! You can start track your mood from now");
    } else {
        await ctx.reply(newUserResponse.message ?? "Something wrong!");
    }
    return;
}

const createUser = async (body: Body): Promise<ResponseAPI> => {
    const response = await axios.post(`${appConfig.API_URL}/api/users`, body);
    return response.data;
};

const setCustomUsername = (username: string): string => {
    return username + "#" + parseInt(String(Math.random() * 10000));
};
