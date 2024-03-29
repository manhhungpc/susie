import { Service } from "typedi";
import { User } from "@models/Mongo/Users";
import { BadRequestError } from "routing-controllers";
import { ErrorMsg } from "@utils/error-msg";
import { slugString } from "@utils/helper";
import { CreateTodayEmotionRequest } from "@requests/emotion/CreateTodayEmotionRequest";
import { Emotion } from "@models/Mongo/Emotions";
import { UserInterface } from "@interfaces/UserInterface";
import moment from "moment";
import { UpdateEmotionRequest } from "@requests/emotion/UpdateEmotionRequest";
import { QueryEmotionRequest } from "@requests/emotion/QueryEmotionRequest";
import { isDate } from "class-validator";

@Service()
export class EmotionService {
    public async getAllEmotions(request: QueryEmotionRequest, user: UserInterface) {
        let query: any = { $and: [] };

        if (request.mood) {
            query.$and.push({ $eq: ["$$emotion.mood", request.mood] });
        }

        if (request.date) {
            query.$and.push({
                $gte: ["$$emotion.date", moment(request.date).startOf("day").toDate()],
                $lte: ["$$emotion.date", moment(request.date).endOf("day").toDate()],
            });
        }

        if (request.note != undefined) {
            const note = request.note == "" ? null : request.note;
            query.$and.push({
                $regexMatch: {
                    input: "$$emotion.note",
                    regex: new RegExp(note, "i"),
                },
            });
        }

        const emotions = await Emotion.aggregate([
            { $match: { year: request.year } },
            {
                $project: {
                    _id: 1,
                    year: 1,
                    user: 1,
                    emotions: {
                        $filter: {
                            input: "$emotions",
                            as: "emotion",
                            cond: query,
                        },
                    },
                },
            },
        ]);

        return emotions;
    }

    public async getEmotionById(id: string) {
        const emotion = await Emotion.findById(id).lean();
        if (!emotion) {
            throw new BadRequestError(ErrorMsg.EMOTION_NOT_FOUND.en);
        }

        return emotion;
    }

    public async createTodayEmotion(request: CreateTodayEmotionRequest, user: UserInterface) {
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

    public async updateEmotion(request: UpdateEmotionRequest, user: UserInterface) {
        let updateData: any = {};

        let query: any = {
            "emotions.date": request.date,
        };

        if (request.note) {
            updateData = {
                $set: {
                    "emotions.$.note": request.note,
                },
            };
        }

        if (request.is_update_latest) {
            const currentYear = new Date().getFullYear().toString();
            const emotion = await Emotion.findOne({ user: user._id, year: currentYear }).lean();

            //@ts-ignore
            const lastEmotion = emotion.emotions.sort((first, second) => second.date - first.date)[0];

            if (!request.mood) {
                throw new BadRequestError(ErrorMsg.MISSING_BODY_FIELDS.en);
            }
            const currentTime = moment(new Date());
            const createdTime = moment(lastEmotion.date);
            const differentHoursInUpdate = Math.round(moment.duration(currentTime.diff(createdTime)).asHours());

            const ALLOW_UPDATE_HOURS = 10;
            if (differentHoursInUpdate < ALLOW_UPDATE_HOURS) {
                updateData.mood = request.mood;
            } else {
                throw new BadRequestError(ErrorMsg.OLD_MOOD_SHOULDNT_HOLD.en);
            }

            query["emotions.date"] = lastEmotion.date;
            updateData = {
                $set: {
                    "emotions.$.mood": updateData.mood ?? lastEmotion.mood,
                    "emotions.$.note": updateData.note ?? lastEmotion.note,
                },
            };
        }

        if (Object.keys(updateData).length == 0) {
            return "No update needed";
        }
        await Emotion.findOneAndUpdate(query, updateData, { new: true });
        return true;
    }
}
