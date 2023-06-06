import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";

export const FirebaseJWTGuard = () => applyDecorators(UseGuards(AuthGuard("firebase-jwt")), ApiBearerAuth());
