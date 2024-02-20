import { serverConfig } from "@config/app";
import { User } from "@models/Mongo/Users";
import { ErrorMsg } from "@utils/error-msg";
import { decodeBase64 } from "@utils/hash";
import { fail } from "@utils/helper";
import { createHash } from "crypto";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";

@Service()
export class JwtCheck implements ExpressMiddlewareInterface {
    async use(request: any, response: any, next: (err?: any) => any) {
        next ? next() : {};
    }
}
