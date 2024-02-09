import { Mood } from "@models/Mongo/Emotions";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTodayEmotionRequest {
    @IsString()
    @IsNotEmpty()
    user: string;

    @IsString()
    @IsNotEmpty()
    source: "telegram" | "discord";

    // @IsNotEmpty()
    @IsOptional()
    mood: Mood;

    @IsString()
    @IsOptional()
    note: string;
}
