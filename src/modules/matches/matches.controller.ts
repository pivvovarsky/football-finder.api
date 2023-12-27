/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MatchesService } from "./matches.service";
import { ListResponse } from "src/common/decorators/list-response.decorator";
import { CreateMatchDto } from "./dto/create-match.dto";
import { MatchItem } from "./models/match-item.model";
import { AuthPayload } from "../auth/models/auth-payload.model";
import { User } from "src/common/decorators/user.decorator";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";

@ApiTags("matches")
@Controller("matches")
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @ApiOperation({ summary: "Get all the matches" })
  @ListResponse(MatchItem)
  @Get()
  async getMany() {
    return await this.matchesService.getMany();
  }

  @ApiOperation({ summary: "Create the match" })
  @Post()
  async create(@Body() body: CreateMatchDto): Promise<MatchItem> {
    return await this.matchesService.createOne(body);
  }

  @ApiOperation({ summary: "Get favourite upcoming matches" })
  @FirebaseJWTGuard()
  @Get("upcoming")
  async getUpcommingMatches(@User() user: AuthPayload) {
    return await this.matchesService.getFavouriteMatches(user.uid);
  }
}
