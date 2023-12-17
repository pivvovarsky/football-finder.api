/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { MatchesService } from "./matches.service";
import { ListResponse } from "src/common/decorators/list-response.decorator";
import { CreateMatchDto } from "./dto/create-match.dto";
import { MatchItem } from "./models/match-item.model";

@ApiTags("matches")
@Controller("matches")
export class MatchesController {
  constructor(private matchesService: MatchesService) {}

  @ApiOperation({ summary: "protected by firbease-JWT - get all the matches" })
  @ListResponse(MatchItem)
  @Get()
  async getMany() {
    return await this.matchesService.getMany();
  }

  //   @ApiOperation({ summary: "protected by firbease-JWT - get one stadium" })
  //   @Get(":id")
  //   async getOne(@Param("id") id: string): Promise<MatchItem> {
  //     return await this.macthesService.getOne(id);
  //   }

  //   @ApiOperation({ summary: "protected by firbease-JWT - update the stadium" })
  //   @Put(":id")
  //   async update(@Param("id") id: string, @Body() body: UpdateStadiumDto): Promise<StadiumItem> {
  //     return await this.stadiumsService.updateOne(id, body);
  //   }

  @Post()
  async create(@Body() body: CreateMatchDto): Promise<MatchItem> {
    return await this.matchesService.createOne(body);
  }
}
