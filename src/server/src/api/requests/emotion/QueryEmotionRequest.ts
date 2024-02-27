import { Mood } from "@models/Mongo/Emotions";
import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class QueryEmotionRequest {
    @IsString()
    @IsNotEmpty()
    year: string;

    @IsOptional()
    mood: Mood;

    @IsDate()
    @IsOptional()
    date: Date;

    @IsString()
    @IsOptional()
    note: string;
}
