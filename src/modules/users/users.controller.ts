/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";
import { User } from "src/common/decorators/user.decorator";
import { ApiKeyGuard } from "src/common/decorators/guards/api-key.decorator";
import { AuthPayload } from "../auth/models/auth-payload.model";
import { UserModel } from "./models/user.model";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiKeyGuard()
  @ApiOperation({ summary: "Get all users" })
  @Get()
  async getAllUsers(): Promise<UserModel[]> {
    return await this.usersService.getMany();
  }

  @FirebaseJWTGuard()
  @ApiOperation({ summary: "Get my user" })
  @Get("/me")
  async getOne(@User("uid") userUid: AuthPayload["uid"]): Promise<UserModel | null> {
    return await this.usersService.getOne(userUid);
  }
}
