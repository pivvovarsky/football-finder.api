import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiSecurity } from "@nestjs/swagger";

export const ApiKeyGuard = () => applyDecorators(UseGuards(AuthGuard("api-key")), ApiSecurity("apiKey"));
