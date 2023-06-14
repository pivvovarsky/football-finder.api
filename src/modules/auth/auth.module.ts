import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { Module } from "@nestjs/common";
import { FirebaseStrategy } from "./strategy/firebase.strategy";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "firebase-jwt" })],
  controllers: [AuthController],
  providers: [AuthService, FirebaseStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
