/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "src/common/decorators";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto";
import { OperationType } from "src/common/enums";
@Public()
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async signUp(@Body() body: RegisterDto) {
    const user = await this.authService.signUp(body);

    if (!!user) {
      this.authService.sendMail(OperationType.SignUp, body.email);
    }
    return user;
  }
}
