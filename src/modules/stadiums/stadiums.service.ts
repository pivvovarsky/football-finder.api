import { Injectable, NotFoundException } from "@nestjs/common";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { Prisma } from "src/generated/prisma/client/mongo";

@Injectable()
export class StadiumsService {
  constructor(private mongoPrismaService: MongoPrismaService) {}

  public async getMany() {
    return await this.mongoPrismaService.stadium.findMany();
  }

  public async getOne(id: string) {
    const stadium = await this.mongoPrismaService.stadium.findFirst({ where: { id: id } });
    if (!stadium) {
      throw new NotFoundException();
    } else return stadium;
  }

  public async updateOne(id: string, data: Prisma.StadiumUpdateInput) {
    return await this.mongoPrismaService.stadium.update({ where: { id: id }, data: data });
  }
}
