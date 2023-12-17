/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common";
import { FirebaseStorageService } from "src/common/services/firebase/firebase-storage.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { Prisma } from "src/generated/prisma/client/mongo";
import { CreateMatchDto } from "./dto/create-match.dto";
import { MatchItem } from "./models/match-item.model";

@Injectable()
export class MatchesService {
  constructor(private mongoPrismaService: MongoPrismaService, private firebaseStorageService: FirebaseStorageService) {}

  public async createOne(data: CreateMatchDto): Promise<MatchItem> {
    return await this.mongoPrismaService.match.create({ data });
  }

  public async getMany() {
    const data = await this.mongoPrismaService.match.findMany({
      include: {
        guest: {
          select: { name: true, imageUrl: true, league: true, country: true, stadium: { select: { name: true } } },
        },
        host: {
          select: { name: true, imageUrl: true, league: true, country: true, stadium: { select: { name: true } } },
        },
      },
    });
    const count = await this.mongoPrismaService.match.count();
    return { data, count };
  }

  public async getAllFavourite() {
    const data = await this.mongoPrismaService.match.findMany({
      include: {
        guest: { select: { name: true, imageUrl: true } },
        host: { select: { name: true, imageUrl: true, stadium: { select: { name: true } } } },
      },
    });
    const count = await this.mongoPrismaService.match.count();
    return { data, count };
  }
}
