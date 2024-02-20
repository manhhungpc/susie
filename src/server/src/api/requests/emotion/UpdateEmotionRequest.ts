import { Mood } from "@models/Mongo/Emotions";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateEmotionRequest {
    @IsDate()
    @IsOptional()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsOptional()
    note: string;

    @IsOptional()
    mood: Mood;

    @IsBoolean()
    is_update_latest: boolean;
}
