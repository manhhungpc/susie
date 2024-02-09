import { Schema, model } from "mongoose";

// 1. create interface
export interface IEmotion extends Document {
    year: string;
    user: Schema.Types.ObjectId;
    emotions: [
        {
            date: Date;
            mood: Mood;
            note?: string;
            // nsfw_day?: boolean;
        },
    ];
}

// 2. create schema
const EmotionSchema: Schema = new Schema(
    {
        year: { type: String },
        user: { type: Schema.Types.ObjectId, ref: "User", require: true },
        emotions: [
            {
                date: { type: Date, unique: true },
                mood: { type: Number },
                note: { type: String, default: "" },
                // nsfw_day: { type: Boolean, default: false },
            },
        ],
    },
    { collection: "emotions", timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export enum Mood {
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
    WONDERFUL = 6,
}

// 3. create model
export const Emotion = model<IEmotion>("Emotion", EmotionSchema);
