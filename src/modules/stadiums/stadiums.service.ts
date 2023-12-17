import { Injectable, NotFoundException } from "@nestjs/common";
import { FirebaseStorageService } from "src/common/services/firebase/firebase-storage.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { Prisma } from "src/generated/prisma/client/mongo";

@Injectable()
export class StadiumsService {
  constructor(private mongoPrismaService: MongoPrismaService, private firebaseStorageService: FirebaseStorageService) {}

  public async getMany() {
    const data = await this.mongoPrismaService.stadium.findMany();
    const count = await this.mongoPrismaService.stadium.count();
    return { data, count };
  }

  public async getOne(id: string) {
    const stadium = await this.mongoPrismaService.stadium.findFirst({ where: { id: id } });
    if (!stadium) {
      throw new NotFoundException();
    } else return stadium;
  }

  public async updateOne(id: string, data: Prisma.StadiumUncheckedUpdateInput) {
    return await this.mongoPrismaService.stadium.update({ where: { id: id }, data });
  }

  public async createOne(data: Prisma.StadiumCreateInput) {
    return await this.mongoPrismaService.stadium.create({ data });
  }

  public async uploadImage(id: string, file: Express.Multer.File) {
    const validStadium = await this.mongoPrismaService.stadium.findUnique({ where: { id } });
    if (!validStadium) throw new NotFoundException("Not found stadium");

    const firebaseImageUrl = await this.firebaseStorageService.uploadImage(id, file);
    await this.mongoPrismaService.stadium.update({ where: { id: id }, data: { imageUrl: firebaseImageUrl } });

    return firebaseImageUrl;
  }

  public async getUrlImage(id: string) {
    const firebaseImageUrl = await this.firebaseStorageService.getImageUrl(id);
    return firebaseImageUrl;
  }
}
