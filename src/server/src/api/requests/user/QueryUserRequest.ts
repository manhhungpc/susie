import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class QueryUserRequest {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    phone_number: string;

    // @IsString()
    @IsOptional()
    telegram: {
        id: string;
        username: string;
    };

    @IsString()
    @IsOptional()
    discord: string;

    @IsString()
    @IsOptional()
    bod: string;
}
