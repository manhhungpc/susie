import { Container, Service } from "typedi";
import { fail, success } from "@utils/helper";
import { UserService } from "@services/userService";
import { Body, Get, JsonController, Param, Post, Put, QueryParams } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { CreateUserRequest } from "@requests/user/CreateUserRequest";
import { CustomError } from "@interfaces/ErrorInterface";
import { UserInfo } from "@base/decorators/UserInfo";
import { UserInterface } from "@interfaces/UserInterface";
import { QueryEmotionRequest } from "@requests/emotion/QueryEmotionRequest";
import { UpdateUserRequest } from "@requests/user/UpdateUserRequest";
import { QueryUserRequest } from "@requests/user/QueryUserRequest";

@Service()
@OpenAPI({
    tags: ["User"],
})
@JsonController("/users")
export class UserController {
    public constructor(private userService: UserService) {}

    @Get()
    public async getUserInfo(@QueryParams() request: QueryUserRequest, @UserInfo() user: UserInterface) {
        return success(await this.userService.getUserInfo(request, user));
    }

    @Get("/:id")
    public async getUserById(@Param("id") id: string) {
        return success(await this.userService.getUserById(id));
    }

    @Post()
    public async createNewUser(@Body() request: CreateUserRequest) {
        return success(await this.userService.createNewUser(request));
    }

    @Put()
    public async updateUser(@Body() request: UpdateUserRequest, @UserInfo() user: UserInterface) {
        return success(await this.userService.updateUser(request, user));
    }
}
