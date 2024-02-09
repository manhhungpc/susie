import { Schema, model } from "mongoose";

// 1. create interface
export interface IUser extends Document {
    name: string;
    username: string;
    bod: string;
    phone_number: string;
    telegram: {
        id: string;
        username: string;
    };
    discord: string;
    // emotions: Schema.Types.ObjectId[];
    time_zone: string;
    start_date: number;
    allow_public: boolean;
    deleted_at: Date;
}

// 2. create schema
const UserSchema: Schema = new Schema(
    {
        name: { type: String },
        username: { type: String },
        phone_number: { type: String },
        telegram: {
            id: { type: String, unique: true, require: true },
            username: { type: String, default: null },
        },
        discord: { type: String, unique: true },
        time_zone: { type: String },
        // emotions: [{ type: Schema.Types.ObjectId, ref: "Emotion", require: true }],
        start_date: { type: Date, require: true },
        allow_public: { type: Boolean, default: false },
        deleted_at: { type: Date, default: null },
    },
    { collection: "users", timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// 3. create model

export const User = model<IUser>("User", UserSchema);
