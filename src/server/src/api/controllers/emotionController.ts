import { Container, Service } from "typedi";
import { success, fail } from "@utils/helper";
import { Body, Get, JsonController, Param, Post, Put, QueryParams, UseBefore } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { UserInfo } from "@base/decorators/UserInfo";
import { UserInterface } from "@base/api/interfaces/UserInterface";
import { QueryEmotionRequest } from "@requests/emotion/QueryEmotionRequest";
import { EmotionService } from "@services/emotionService";
import { CreateTodayEmotionRequest } from "@requests/emotion/CreateTodayEmotionRequest";
import { BotKeyCheck } from "@middlewares/BotKeyCheck";
import { CustomError } from "@interfaces/ErrorInterface";
import { UpdateEmotionRequest } from "@requests/emotion/UpdateEmotionRequest";

@Service()
@OpenAPI({
    tags: ["Emotion"],
})
@JsonController("/emotion")
@UseBefore(BotKeyCheck)
export class EmotionController {
    public constructor(private emotionService: EmotionService) {}

    @Get()
    public async getAllEmotion(@QueryParams() request: QueryEmotionRequest, @UserInfo() user: UserInterface) {
        return success(await this.emotionService.getAllEmotions(request, user));
    }

    @Get("/:id")
    public async getEmotionById(@Param("id") id: string) {
        return success(await this.emotionService.getEmotionById(id));
    }

    @Post("/today")
    public async createTodayEmotion(@Body() request: CreateTodayEmotionRequest, @UserInfo() user: UserInterface) {
        return success(await this.emotionService.createTodayEmotion(request, user));
    }

    @Put()
    public async updateTodayEmotion(@Body() request: UpdateEmotionRequest, @UserInfo() user: UserInterface) {
        return success(await this.emotionService.updateEmotion(request, user));
    }
}
