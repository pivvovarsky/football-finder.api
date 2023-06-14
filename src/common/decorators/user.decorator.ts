import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthPayload } from "src/modules/auth/models/auth-payload.model";

export const User = createParamDecorator((data: keyof AuthPayload, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  return data ? user[data] : user;
});
