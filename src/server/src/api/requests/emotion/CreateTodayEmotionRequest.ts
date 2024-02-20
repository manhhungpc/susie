import { Mood } from "@models/Mongo/Emotions";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTodayEmotionRequest {
    @IsString()
    @IsNotEmpty()
    user: string;

    // @IsNotEmpty()
    @IsOptional()
    mood: Mood;

    @IsString()
    @IsOptional()
    note: string;
}
