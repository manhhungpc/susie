import { Service } from "typedi";
import { User } from "@models/Mongo/Users";
import { BadRequestError } from "routing-controllers";
import { ErrorMsg } from "@utils/error-msg";
import { slugString } from "@utils/helper";
import { CreateTodayEmotionRequest } from "@requests/CreateTodayEmotionRequest";
import { Emotion } from "@models/Mongo/Emotions";

@Service()
export class EmotionService {
    public async getAllEmotions() {}

    public async createTodayEmotion(request: CreateTodayEmotionRequest) {
        let query: any;
        if (request.source == "telegram") {
            query = { "telegram.id": request.user };
        }
        const user = await User.findOne(query).lean();

        if (!user) {
            throw new BadRequestError(ErrorMsg.USER_NOT_FOUND.en);
        }

        const currentYear = new Date().getFullYear().toString();
        const currentEmotion = await Emotion.findOne({ user: user._id, year: currentYear }).lean();

        if (!currentEmotion) {
            await this.createNewYearEmotion(user._id.toString(), request);
            return true;
        }

        const hasTodayEmotion = currentEmotion.emotions.find(
            (emo) => emo.date.toDateString() == new Date().toDateString(),
        );
        if (hasTodayEmotion) {
            throw new BadRequestError(ErrorMsg.ALREADY_LOG_TODAY_EMOTION.en);
        }
        await Emotion.findByIdAndUpdate(currentEmotion._id, {
            $push: {
                emotions: {
                    date: new Date(),
                    mood: request.mood,
                    note: request.note ?? null,
                },
            },
        });
        return true;
    }

    private async createNewYearEmotion(userId: string, data: any) {
        const currentYear = new Date().getFullYear().toString();

        const newYearEmotion = new Emotion({
            year: currentYear,
            user: userId,
            emotions: [
                {
                    date: new Date(),
                    mood: data.mood,
                    note: data.note ?? null,
                },
            ],
        });

        await newYearEmotion.save();
    }
}
