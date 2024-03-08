import { serverConfig } from "@config/app";
import { User } from "@models/Mongo/Users";
import { ErrorMsg } from "@utils/error-msg";
import { decodeBase64 } from "@utils/hash";
import { fail } from "@utils/helper";
import { createHash } from "crypto";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import jwt from "jsonwebtoken";

@Service()
export class JwtCheck implements ExpressMiddlewareInterface {
    async use(request: any, response: any, next: (err?: any) => any) {
        const authHeader = request.headers.authorization as string;
        if (!authHeader) {
            return response.status(401).send(fail(401, ErrorMsg.INVALID_AUTH_HEADER.en));
        }
        const token = authHeader.split(" ")[1];

        const payload = await this.jwtVerify(token);
        if (payload instanceof Error) {
            return response.status(401).send(fail(401, ErrorMsg.AUTHORIZE_FAILED.en));
        }
        const userData = await User.findOne({
            $or: [{ "telegram.id": payload.user }, { discord: payload.user }],
        }).lean();

        if (!userData) {
            return response.status(401).send(fail(401, ErrorMsg.USER_NOT_FOUND.en));
        }
        request.userData = userData;
        next ? next() : {};
    }

    async jwtVerify(token: string): Promise<any | Error> {
        return await new Promise<any>((resolve, _) => {
            jwt.verify(token, serverConfig.SECRET_KEY, (err: Error, decoded: any) => {
                if (err) {
                    return resolve(err);
                }
                return resolve(decoded);
            });
        });
    }
}
