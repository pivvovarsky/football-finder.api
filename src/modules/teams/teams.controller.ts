import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Team } from "src/generated/prisma/client/mongo";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { CreateTeamDto } from "./dto/create-team.dto";
import { ApiKeyGuard } from "src/common/decorators/guards/api-key.decorator";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";

@FirebaseJWTGuard()
@ApiTags("teams")
@Controller("teams")
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @ApiOperation({ summary: "protected by firbease-JWT" })
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

  @Get(":id/imageUrl")
  async getUrlImage(@Param("id") id: string) {
    return await this.teamsService.getUrlImage(id);
  }
}
