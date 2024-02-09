import { Service } from "typedi";
import { CreateUserRequest } from "@requests/CreateUserRequest";
import { User } from "@models/Mongo/Users";
import { BadRequestError } from "routing-controllers";
import { ErrorMsg } from "@utils/error-msg";
import { slugString } from "@utils/helper";

@Service()
export class UserService {
    public async createNewUser(request: CreateUserRequest) {
        if ((!request.telegram || !request.discord) && !request.name) {
            throw new BadRequestError(ErrorMsg.MISSING_BODY_FIELDS.en);
        }
        const isExist = await User.exists({ $or: [{ telegram: request.telegram.id }, { discord: request.discord }] });
        if (isExist) {
            throw new BadRequestError(ErrorMsg.USER_EXISTED.en);
        }

        // const defaultUsername = request.name.split(" ").pop() + " " + (request.telegram ?? request.discord);
        const newUser = new User({
            name: request.name,
            username: request.username ?? null,
            phone_number: request.phone_number ?? null,
            telegram: {
                id: request.telegram.id,
                username: request.telegram.username ?? "",
            },
            discord: request.discord ?? null,
            start_date: new Date(),
        });
        const user = await newUser.save();

        return user.toJSON();
    }
}
