import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { ApiBody, ApiConsumes, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Team } from "src/generated/prisma/client/mongo";
import { FileInterceptor } from "@nestjs/platform-express";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";
import { User } from "src/common/decorators/user.decorator";
import { AuthPayload } from "../auth/models/auth-payload.model";
import { ApiKeyGuard } from "src/common/decorators/guards/api-key.decorator";
import { TeamItemWithStadium } from "./models/team-item-with-stadium.model";
import { ListResponse } from "src/common/decorators/list-response.decorator";
import { TeamItem } from "./models/team-item.model";
import { TeamImageModel } from "./models/team-image.model";

@ApiTags("teams")
@Controller("teams")
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @FirebaseJWTGuard()
  @ApiExtraModels(TeamItem)
  @ListResponse(TeamItem)
  @Get()
  async getMany() {
    return await this.teamsService.getMany();
  }

  @FirebaseJWTGuard()
  @ApiExtraModels(TeamItem)
  @ListResponse(TeamItem)
  @Get("/favourite-first")
  async getManyFavouriteFirst(@User() user: AuthPayload) {
    return await this.teamsService.getManyFavouriteFirst(user.uid);
  }

  @Get(":id")
  async getOne(@Param("id") id: string): Promise<TeamItemWithStadium> {
    return await this.teamsService.getOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: UpdateTeamDto): Promise<TeamItem> {
    return await this.teamsService.updateOne(id, body);
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
  async uploadImage(@Param("id") id: string, @UploadedFile() file: Express.Multer.File): Promise<void> {
    await this.teamsService.uploadImage(id, file);
  }

  @Get(":id/imageUrl")
  async getUrlImage(@Param("id") id: string): Promise<TeamImageModel> {
    return await this.teamsService.getUrlImage(id);
  }

  @ApiKeyGuard()
  @Delete(":id")
  async delete(@Param("id") id: string): Promise<void> {
    await this.teamsService.deleteOne(id);
  }
}
