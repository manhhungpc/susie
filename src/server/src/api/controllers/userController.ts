import { Container, Service } from "typedi";
import { fail, success } from "@utils/helper";
import { UserService } from "@services/userService";
import { Body, Get, JsonController, Post, Put } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { CreateUserRequest } from "@requests/CreateUserRequest";
import { CustomError } from "@interfaces/ErrorInterface";

@Service()
@OpenAPI({
    tags: ["User"],
})
@JsonController("/users")
export class UserController {
    // public auth = Container.get(AuthService);
    public constructor(private userService: UserService) {}

    @Post()
    public async createNewUser(@Body() request: CreateUserRequest) {
        try {
            return success(await this.userService.createNewUser(request));
        } catch (error) {
            error = error as CustomError;
            return fail(error.httpCode, error.message);
        }
    }

    @Put()
    public async updateUser() {
        // return success(await this.userService.newUser());
    }
}
