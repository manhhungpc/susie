import jwt from "jsonwebtoken";
import { appConfig } from "../config/app";

interface JwtPayload {
    user: string;
}
export function generateJWT(data: JwtPayload): string {
    const token = jwt.sign(data, appConfig.JWT_KEY, { expiresIn: 60 * 15 });
    return token;
}
