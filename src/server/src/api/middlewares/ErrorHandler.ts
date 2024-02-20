import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from "routing-controllers";
import { logger } from "@utils/logger";
import { Service } from "typedi";
import { fail } from "@utils/helper";

@Service()
@Middleware({ type: "after" })
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
    public error(error: any, request: any, response: any, next: (err: any) => any) {
        logger.error(
            `[${request.method}] ${request.path} >> StatusCode:: ${error.httpCode}, Message:: ${error.message}`,
        );
        response.status(error.httpCode).json(fail(error.httpCode, error.message));
    }
}
