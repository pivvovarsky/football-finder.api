/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from "@nestjs/common";
import { FirebaseStorageService, MongoPrismaService } from "src/common/services";
import { Prisma, Team } from "src/generated/prisma/client/mongo";
import { TeamItem } from "./models";
import { CreateTeamDto } from "./dto";

@Injectable()
export class TeamsService {
  constructor(private mongoPrismaService: MongoPrismaService, private firebaseStorageService: FirebaseStorageService) {}

  public async create(data: Prisma.TeamCreateInput) {
    return await this.mongoPrismaService.team.create({ data });
  }

  public async getMany() {
    return await this.mongoPrismaService.team.findMany();
  }

  public async getOne(id: string) {
    const team = await this.mongoPrismaService.team.findFirst({ where: { id: id } });
    if (!team) {
      throw new NotFoundException();
    } else return team;
  }

  public async updateOne(id: string, data: Prisma.TeamUpdateInput) {
    return await this.mongoPrismaService.team.update({ where: { id: id }, data: data });
  }

  public async deleteOne(id: string) {
    return await this.mongoPrismaService.team.delete({ where: { id: id } });
  }

  public async uploadImage(id: string, file: Express.Multer.File) {
    const firebaseImageUrl = await this.firebaseStorageService.uploadImage(id, file);
    await this.mongoPrismaService.team.update({ where: { id: id }, data: { imageUrl: firebaseImageUrl } });
    return firebaseImageUrl;
  }
}
