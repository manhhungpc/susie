import { Container, Service } from "typedi";
import { success, fail } from "@utils/helper";
import { Body, Get, JsonController, Param, Post, Put, QueryParams, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { UserInfo } from "@base/decorators/UserInfo";
import { UserInterface } from "@base/api/interfaces/UserInterface";
import { QueryEmotionRequest } from "@requests/QueryEmotionRequest";
import { EmotionService } from "@services/emotionService";
import { CreateTodayEmotionRequest } from "@requests/CreateTodayEmotionRequest";
import { BotKeyCheck } from "@middlewares/BotKeyCheck";

@Service()
@OpenAPI({
    tags: ["Emotion"],
})
@JsonController("/emotion")
// @UseBefore(BotKeyCheck)
export class EmotionController {
    public constructor(private emotionService: EmotionService) {}

    @Get()
    public async getAllEmotion(@QueryParams() request: QueryEmotionRequest, @UserInfo() user: UserInterface) {
        return success(await this.emotionService.getAllEmotions());
    }

    @Post("/today")
    public async createTodayEmotion(@Body() request: CreateTodayEmotionRequest) {
        try {
            return success(await this.emotionService.createTodayEmotion(request));
        } catch (err) {
            return fail(err.httpCode, err.message);
        }
    }

    @Put("/:id")
    public async updateDateEmotion(@UserInfo() user: UserInterface) {
        // return success(await this.emotionService.test());
    }
}
