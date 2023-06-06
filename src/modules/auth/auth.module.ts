import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";
import { FirebaseStrategy } from "./strategy/firebase.strategy";

@Module({
  imports: [PassportModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, FirebaseStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
