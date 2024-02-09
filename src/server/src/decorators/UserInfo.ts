import { createParamDecorator } from "routing-controllers";

export function UserInfo() {
    return createParamDecorator({
        value: (action) => {
            return action.request.user;
        },
    });
}
