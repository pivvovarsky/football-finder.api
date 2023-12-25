import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { FirebaseStorageService } from "src/common/services/firebase/firebase-storage.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { Prisma, Team } from "src/generated/prisma/client/mongo";

const SORT_BY: "asc" | "desc" = "asc";
@Injectable()
export class TeamsService {
  constructor(private mongoPrismaService: MongoPrismaService, private firebaseStorageService: FirebaseStorageService) {}

  private isValidID(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(
        "Invalid ID - ObjectID: provided hex string representation must be exactly 12 bytes",
      );
    }
  }

  public async create(data: Prisma.TeamCreateInput) {
    return await this.mongoPrismaService.team.create({
      include: { stadium: true },
      data: { ...data, stadium: { create: { name: data.name, latitude: 0, longitude: 0 } } },
    });
  }

  public async getMany(userUid: string) {
    const favoriteTeams = await this.mongoPrismaService.favoriteTeam.findMany({
      where: {
        userId: userUid,
      },
      include: {
        team: true,
      },
      orderBy: { team: { name: SORT_BY } },
    });

    const favoriteTeamObjects = favoriteTeams.map((favoriteTeam) => favoriteTeam.team);
    const favoriteTeamIds = favoriteTeams.map((favoriteTeam) => favoriteTeam.teamId);

    const otherTeams = await this.mongoPrismaService.team.findMany({
      where: {
        id: {
          notIn: favoriteTeamIds,
        },
      },
      orderBy: { name: SORT_BY },
    });

    const allTeams: Team[] = [...favoriteTeamObjects, ...otherTeams];

    return { data: allTeams, count: allTeams.length };
  }

  public async getOne(id: string) {
    this.isValidID(id);
    const team = await this.mongoPrismaService.team.findFirst({ where: { id: id }, include: { stadium: true } });
    if (!team) {
      throw new NotFoundException();
    } else return team;
  }

  public async updateOne(id: string, data: Prisma.TeamUpdateInput) {
    this.isValidID(id);
    return await this.mongoPrismaService.team.update({ where: { id: id }, data: data });
  }

  public async deleteOne(id: string) {
    this.isValidID(id);
    await await this.mongoPrismaService.team.delete({ where: { id: id } });
  }

  public async uploadImage(id: string, file: Express.Multer.File) {
    this.isValidID(id);
    const validTeam = await this.mongoPrismaService.team.findUnique({ where: { id } });
    if (!validTeam) throw new NotFoundException("Not found team");

    const firebaseImageUrl = await this.firebaseStorageService.uploadImage(id, file);
    await this.mongoPrismaService.team.update({ where: { id: id }, data: { imageUrl: firebaseImageUrl } });
    return firebaseImageUrl;
  }

  public async getUrlImage(id: string) {
    this.isValidID(id);
    const firebaseImageUrl = await this.firebaseStorageService.getImageUrl(id);
    return firebaseImageUrl;
  }
}
