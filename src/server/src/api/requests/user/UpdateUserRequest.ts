import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserRequest {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    phone_number: string;

    @IsString()
    @IsOptional()
    bod: string;

    @IsBoolean()
    @IsOptional()
    allow_public: boolean;

    @IsString()
    @IsOptional()
    time_zone: string;
}
