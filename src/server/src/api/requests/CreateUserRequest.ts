import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserRequest {
    @IsString()
    @IsNotEmpty()
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
