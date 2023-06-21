import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { StadiumsService } from "./stadiums.service";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { StadiumItem } from "./models/stadium-item.model";
import { UpdateStadiumDto } from "./dto/update-stadium.dto";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";

@FirebaseJWTGuard()
@ApiTags("stadiums")
@Controller("stadiums")
export class StadiumsController {
  constructor(private stadiumsService: StadiumsService) {}

  @ApiOperation({ summary: "protected by firbease-JWT" })
  @Get()
  async getMany(): Promise<StadiumItem[]> {
    return await this.stadiumsService.getMany();
  }

  @Get(":id")
  async getOne(@Param("id") id: string): Promise<StadiumItem> {
    return await this.stadiumsService.getOne(id);
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: UpdateStadiumDto): Promise<StadiumItem> {
    return await this.stadiumsService.updateOne(id, body);
  }
}
