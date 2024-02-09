import { serverConfig } from "@config/app";
import { ErrorMsg } from "@utils/error-msg";
import { decodeBase64 } from "@utils/hash";
import { fail } from "@utils/helper";
import { createHash } from "crypto";
import { ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";

interface AuthHash {
    user: string;
    hash: string;
}

@Service()
export class BotKeyCheck implements ExpressMiddlewareInterface {
    use(request: any, response: any, next: (err?: any) => any) {
        const botAuth = request.headers["x-bot-key"];
        if (!botAuth) {
            return response.status(403).send(fail(403, ErrorMsg.FORBIDDEN.en));
        }

        const clientData: AuthHash = decodeBase64(botAuth);
        const serverHash = createHash("sha256")
            .update(clientData.user + serverConfig.BOT_KEY)
            .digest("hex");

        if (serverHash != clientData.hash) {
            return response.status(401).send(fail(401, ErrorMsg.AUTHORIZE_FAILED.en));
        }
        next ? next() : {};
    }
}
