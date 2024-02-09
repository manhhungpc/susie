import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class QueryEmotionRequest {
    @IsString()
    @IsOptional()
    year: number;

    @IsString()
    @IsOptional()
    date: Date;

    @IsString()
    @IsOptional()
    id: string;
}
