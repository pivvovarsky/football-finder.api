import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { StadiumsService } from "./stadiums.service";
import { Body, Controller, Get, Param, Post, Put, Delete, UploadedFile, UseInterceptors } from "@nestjs/common";
import { StadiumItem } from "./models/stadium-item.model";
import { UpdateStadiumDto } from "./dto/update-stadium.dto";
import { CreateStadiumDto } from "./dto/create-stadium.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Prisma } from "src/generated/prisma/client/mongo";
import { ListResponse } from "src/common/decorators/list-response.decorator";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";
import { ApiKeyGuard } from "src/common/decorators/guards/api-key.decorator";
import { StadiumImageModel } from "./models/stadium-image.model";
import { NextMatchModel } from "./models/stadium-next-match.model";
import { Public } from "src/common/decorators/public.decorator";

@ApiTags("stadiums")
@Controller("stadiums")
export class StadiumsController {
  constructor(private stadiumsService: StadiumsService) {}

  @Public()
  @ListResponse(StadiumItem)
  @Get()
  async getMany() {
    return await this.stadiumsService.getMany();
  }

  @FirebaseJWTGuard()
  @Get(":id")
  async getOne(@Param("id") id: string): Promise<StadiumItem> {
    return await this.stadiumsService.getOne(id);
  }

  @ApiKeyGuard()
  @Put(":id")
  async update(@Param("id") id: string, @Body() body: UpdateStadiumDto): Promise<StadiumItem> {
    return await this.stadiumsService.updateOne(id, body);
  }

  @ApiKeyGuard()
  @Post()
  async create(@Body() body: CreateStadiumDto): Promise<StadiumItem> {
    const { teamName, league, country, ...stadium } = body;
    const data: Prisma.StadiumCreateInput = {
      ...stadium,
      team: {
        create: { name: teamName, league, country },
      },
    };

    return await this.stadiumsService.createOne(data);
  }

  @ApiKeyGuard()
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
    await this.stadiumsService.uploadImage(id, file);
  }

  @ApiKeyGuard()
  @Get(":id/imageUrl")
  async getUrlImage(@Param("id") id: string): Promise<StadiumImageModel> {
    return await this.stadiumsService.getUrlImage(id);
  }

  @FirebaseJWTGuard()
  @Get(":id/next-match")
  async getNextMatch(@Param("id") id: string): Promise<NextMatchModel> {
    return await this.stadiumsService.getNextMatch(id);
  }
}
