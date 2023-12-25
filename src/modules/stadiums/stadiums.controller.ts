import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { StadiumsService } from "./stadiums.service";
import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { StadiumItem } from "./models/stadium-item.model";
import { UpdateStadiumDto } from "./dto/update-stadium.dto";
import { CreateStadiumDto } from "./dto/create-stadium.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Prisma } from "src/generated/prisma/client/mongo";
import { ListResponse } from "src/common/decorators/list-response.decorator";
import { ObjectId } from "mongodb";

// @FirebaseJWTGuard()
//TODO
@ApiTags("stadiums")
@Controller("stadiums")
export class StadiumsController {
  constructor(private stadiumsService: StadiumsService) {}

  @ApiOperation({ summary: "protected by firbease-JWT - get all the stadiums" })
  @ListResponse(StadiumItem)
  @Get()
  async getMany() {
    return await this.stadiumsService.getMany();
  }

  @ApiOperation({ summary: "protected by firbease-JWT - get one stadium" })
  @Get(":id")
  async getOne(@Param("id") id: string): Promise<StadiumItem> {
    return await this.stadiumsService.getOne(id);
  }

  @ApiOperation({ summary: "protected by firbease-JWT - update the stadium" })
  @Put(":id")
  async update(@Param("id") id: string, @Body() body: UpdateStadiumDto): Promise<StadiumItem> {
    return await this.stadiumsService.updateOne(id, body);
  }

  @Post()
  async create(@Body() body: CreateStadiumDto): Promise<StadiumItem> {
    const data: Prisma.StadiumCreateInput = {
      name: body.name,
      latitude: body.latitude,
      longitude: body.longitude,
      description: body.description,
      websiteUrl: body.websiteUrl,
      team: {
        create: { name: body.teamName, league: body.league, country: body.country },
      },
    };

    return await this.stadiumsService.createOne(data);
  }

  @ApiOperation({ summary: "upload an image for the stadium" })
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

  @ApiOperation({ summary: "get uploaded image" })
  @Get(":id/imageUrl")
  async getUrlImage(@Param("id") id: string) {
    return await this.stadiumsService.getUrlImage(id);
  }

  @ApiOperation({ summary: "get next match at stadium" })
  @Get(":id/next-match")
  async getNextMatch(@Param("id") id: string) {
    return await this.stadiumsService.getNextMatch(id);
  }
}
