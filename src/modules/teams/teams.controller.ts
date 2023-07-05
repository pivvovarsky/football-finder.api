import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Team } from "src/generated/prisma/client/mongo";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { CreateTeamDto } from "./dto/create-team.dto";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";
import { TeamItem } from "./models/team-item.model";

@FirebaseJWTGuard()
@ApiTags("teams")
@Controller("teams")
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @ApiOperation({ summary: "protected by firbease-JWT - get all the teams" })
  @Get()
  async getMany(): Promise<TeamItem[]> {
    return await this.teamsService.getMany();
  }

  @ApiOperation({ summary: "get one team" })
  @Get(":id")
  async getOne(@Param("id") id: string): Promise<TeamItem> {
    return await this.teamsService.getOne(id);
  }

  @ApiOperation({ summary: "create a team" })
  @Post()
  async create(@Body() body: CreateTeamDto): Promise<Team> {
    return await this.teamsService.create(body);
  }

  @ApiOperation({ summary: "update team" })
  @Put(":id")
  async update(@Param("id") id: string, @Body() body: UpdateTeamDto): Promise<Team> {
    return await this.teamsService.updateOne(id, body);
  }

  @ApiOperation({ summary: "delete team" })
  @Delete(":id")
  async delete(@Param("id") id: string): Promise<void> {
    await this.teamsService.deleteOne(id);
  }

  @ApiOperation({ summary: "upload an image for the team" })
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

  @ApiOperation({ summary: "get uploaded image" })
  @Get(":id/imageUrl")
  async getUrlImage(@Param("id") id: string) {
    return await this.teamsService.getUrlImage(id);
  }
}
