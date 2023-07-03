import { Injectable, NotFoundException } from "@nestjs/common";
import { FirebaseStorageService } from "src/common/services/firebase/firebase-storage.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { Prisma } from "src/generated/prisma/client/mongo";
import { TeamItem } from "./models/team-item.model";

@Injectable()
export class TeamsService {
  constructor(private mongoPrismaService: MongoPrismaService, private firebaseStorageService: FirebaseStorageService) {}

  public async create(data: Prisma.TeamCreateInput) {
    return await this.mongoPrismaService.team.create({
      data: { ...data, stadium: { create: { name: data.name, latitude: 0, longitude: 0 } } },
    });
  }

  public async getMany(): Promise<TeamItem[]> {
    return await this.mongoPrismaService.team.findMany({ include: { stadium: true } });
  }

  public async getOne(id: string) {
    const team = await this.mongoPrismaService.team.findFirst({ where: { id: id }, include: { stadium: true } });
    if (!team) {
      throw new NotFoundException();
    } else return team;
  }

  public async updateOne(id: string, data: Prisma.TeamUpdateInput) {
    return await this.mongoPrismaService.team.update({ where: { id: id }, data: data });
  }

  public async deleteOne(id: string) {
    await await this.mongoPrismaService.team.delete({ where: { id: id } });
  }

  public async uploadImage(id: string, file: Express.Multer.File) {
    const firebaseImageUrl = await this.firebaseStorageService.uploadImage(id, file);
    await this.mongoPrismaService.team.update({ where: { id: id }, data: { imageUrl: firebaseImageUrl } });
    return firebaseImageUrl;
  }

  public async getUrlImage(id: string) {
    const firebaseImageUrl = await this.firebaseStorageService.getImageUrl(id);
    return firebaseImageUrl;
  }
}
