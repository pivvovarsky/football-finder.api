/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ChangePasswordDto, ForgotPasswordDto, RegisterDto } from "./dto";
import { OperationType } from "src/common/enums";
import { Public, User } from "src/common/decorators";
import { AuthPayload } from "./models";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";
@Public()
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post("register")
  async signUp(@Body() body: RegisterDto) {
    const user = await this.authService.signUp(body);

    if (!!user) {
      this.authService.sendMail(OperationType.SignUp, body.email);
    }
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post("forgot-password")
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<void> {
    await this.authService.sendMail(OperationType.ForgotPassword, body.email);
  }

  @FirebaseJWTGuard()
  @Post("change-password")
  async changePassword(@User() user: AuthPayload, @Body() body: ChangePasswordDto): Promise<void> {
    const data = { id: user.uid, newPassword: body.password };
    await this.authService.changePassword(data);
  }
}
