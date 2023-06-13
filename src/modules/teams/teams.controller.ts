/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { CreateTeamDto, UpdateTeamDto } from "./dto";
import { Team } from "src/generated/prisma/client/mongo";
import { PatchTeamImageDto } from "./dto/patch-team-image.dto";
import { FileInterceptor } from "@nestjs/platform-express";

// @FirebaseJWTGuard()
@ApiTags("teams")
@Controller("teams")
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  async getMany(): Promise<Team[]> {
    return await this.teamsService.getMany();
  }

  @Get(":id")
  async getOne(@Param("id") id: string): Promise<Team> {
    return await this.teamsService.getOne(id);
  }

  @Post()
  async create(@Body() body: CreateTeamDto): Promise<Team> {
    return await this.teamsService.create(body);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: UpdateTeamDto): Promise<Team> {
    return await this.teamsService.updateOne(id, body);
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<void> {
    await this.teamsService.deleteOne(id);
  }

  @Post(":id/image")
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(@Param("id") id: string, @UploadedFile() file: Express.Multer.File) {
    return await this.teamsService.uploadImage(id, file);
  }
}
