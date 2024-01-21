import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { FirebaseStorageService } from "src/common/services/firebase/firebase-storage.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { Prisma, Team } from "src/generated/prisma/client/mongo";
import { TeamItem } from "./models/team-item.model";

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

  public async getMany() {
    const [teams, teamsCount] = await Promise.all([
      this.mongoPrismaService.team.findMany({}),
      this.mongoPrismaService.team.count({}),
    ]);
    return { data: teams, count: teamsCount };
  }

  public async getManyFavouriteFirst(userUid: string) {
    const favouriteTeams = await this.getFavouriteTeams(userUid);
    const favouriteTeamIds = favouriteTeams.map((team) => team.id);

    const nonFavouriteTeams = await this.getNonFavouriteTeams(favouriteTeamIds);

    const allTeamsFavouriteFirst: TeamItem[] = [...favouriteTeams, ...nonFavouriteTeams];

    return { data: allTeamsFavouriteFirst, count: allTeamsFavouriteFirst.length };
  }

  private async getFavouriteTeams(userUid: string) {
    const favouriteTeams = await this.mongoPrismaService.favouriteTeam.findMany({
      where: {
        userId: userUid,
      },
      include: {
        team: true,
      },
      orderBy: { team: { name: SORT_BY } },
    });

    return favouriteTeams.map((favouriteTeam) => favouriteTeam.team);
  }

  private async getNonFavouriteTeams(favouriteTeamIds: string[]) {
    return this.mongoPrismaService.team.findMany({
      where: {
        id: {
          notIn: favouriteTeamIds,
        },
      },
      orderBy: { name: SORT_BY },
    });
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
    const team = await this.mongoPrismaService.team.findFirst({ where: { id, imageUrl: { not: null } } });
    if (!team) throw new NotFoundException("Image url not found");
    const firebaseImageUrl = await this.firebaseStorageService.getImageUrl(id);
    return firebaseImageUrl;
  }
}
