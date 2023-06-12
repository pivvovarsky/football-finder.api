/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";
import { ApiTags } from "@nestjs/swagger";
import { CreateTeamDto } from "./dto";

// @FirebaseJWTGuard()
@ApiTags("teams")
@Controller("teams")
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Post()
  async create(@Body() body: CreateTeamDto) {
    return this.teamsService.create(body);
  }
}
