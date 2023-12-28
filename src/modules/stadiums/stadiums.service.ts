import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { FirebaseStorageService } from "src/common/services/firebase/firebase-storage.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { Prisma } from "src/generated/prisma/client/mongo";

@Injectable()
export class StadiumsService {
  constructor(private mongoPrismaService: MongoPrismaService, private firebaseStorageService: FirebaseStorageService) {}

  private isValidID(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(
        "Invalid ID - ObjectID: provided hex string representation must be exactly 12 bytes",
      );
    }
  }

  public async getMany() {
    const data = await this.mongoPrismaService.stadium.findMany({ where: { imageUrl: { not: null } } });
    const count = await this.mongoPrismaService.stadium.count({ where: { imageUrl: { not: null } } });
    return { data, count };
  }

  public async getOne(id: string) {
    this.isValidID(id);
    const stadium = await this.mongoPrismaService.stadium.findFirst({ where: { id: id } });
    if (!stadium) {
      throw new NotFoundException();
    } else return stadium;
  }

  public async updateOne(id: string, data: Prisma.StadiumUncheckedUpdateInput) {
    this.isValidID(id);
    return await this.mongoPrismaService.stadium.update({ where: { id: id }, data });
  }

  public async createOne(data: Prisma.StadiumCreateInput) {
    return await this.mongoPrismaService.stadium.create({ data });
  }

  public async uploadImage(id: string, file: Express.Multer.File) {
    this.isValidID(id);
    const validStadium = await this.mongoPrismaService.stadium.findUnique({ where: { id } });
    if (!validStadium) throw new NotFoundException("Not found stadium");

    const firebaseImageUrl = await this.firebaseStorageService.uploadImage(id, file);
    await this.mongoPrismaService.stadium.update({ where: { id: id }, data: { imageUrl: firebaseImageUrl } });

    return firebaseImageUrl;
  }

  public async getUrlImage(id: string) {
    this.isValidID(id);
    const stadium = await this.mongoPrismaService.stadium.findFirst({ where: { id, imageUrl: { not: null } } });
    if (!stadium) throw new NotFoundException("Image url not found");
    const firebaseImageUrl = await this.firebaseStorageService.getImageUrl(id);
    return firebaseImageUrl;
  }

  public async getNextMatch(stadiumId: string) {
    this.isValidID(stadiumId);
    const stadium = await this.mongoPrismaService.stadium.findUniqueOrThrow({ where: { id: stadiumId } });
    if (!stadium) {
      throw new NotFoundException();
    }
    const today = new Date();
    const matches = await this.mongoPrismaService.match.findMany({
      where: { host: { stadium: { id: stadiumId } }, date: { gte: today } },
      orderBy: { date: "asc" },
      include: { host: { select: { name: true } }, guest: { select: { name: true } } },
    });

    return { ...matches[0] };
  }
}
