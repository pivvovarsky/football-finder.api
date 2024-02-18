/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable } from "@nestjs/common";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { CreateMatchDto } from "./dto/create-match.dto";
import { MatchItem } from "./models/match-item.model";
import { UpcomingMatchItem } from "./models/upcoming-match-item.model";
import { ObjectId } from "mongodb";

const MAX_SIZE = 2;
@Injectable()
export class MatchesService {
  constructor(private mongoPrismaService: MongoPrismaService) {}
  private isValidID(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(
        "Invalid ID - ObjectID: provided hex string representation must be exactly 12 bytes",
      );
    }
  }

  public async createOne(data: CreateMatchDto): Promise<MatchItem> {
    if (data.hostId === data.guestId) throw new BadRequestException("Host and Guest cannot be the same");
    const [host, guest] = await Promise.all([
      this.mongoPrismaService.team.findUnique({ where: { id: data.hostId } }),
      this.mongoPrismaService.team.findUnique({ where: { id: data.guestId } }),
    ]);

    if (!host || !guest) throw new BadRequestException("Host or Guest not found");

    return await this.mongoPrismaService.match.create({ data });
  }

  public async createMany(data: CreateMatchDto[]) {
    await this.mongoPrismaService.match.createMany({ data });
  }

  public async getMany() {
    const data = await this.mongoPrismaService.match.findMany({});
    const count = await this.mongoPrismaService.match.count();
    return { data, count };
  }

  public async getUpcomingWithFavouriteMatches(userUid: string) {
    if (!userUid) throw new BadRequestException("Enter correct userUid");

    const [favouriteTeams, favouriteStadiums] = await Promise.all([
      this.mongoPrismaService.favouriteTeam.findMany({ where: { userId: userUid } }),
      this.mongoPrismaService.favouriteStadium.findMany({ where: { userId: userUid } }),
    ]);

    const today = new Date();

    const matchesPromises = favouriteTeams.map((favTeam) =>
      this.mongoPrismaService.match.findMany({
        take: MAX_SIZE,
        where: { OR: [{ hostId: favTeam.teamId }, { guestId: favTeam.teamId }], date: { gte: today } },
        orderBy: { date: "asc" },
        include: {
          guest: { select: { name: true, imageUrl: true } },
          host: { select: { name: true, imageUrl: true, league: true, country: true, stadium: true } },
        },
      }),
    );

    const stadiumMatchesPromises = favouriteStadiums.map((favStadium) =>
      this.mongoPrismaService.match.findMany({
        where: { host: { stadium: { id: favStadium.stadiumId } }, date: { gte: today } },
        take: MAX_SIZE,
        orderBy: { date: "asc" },
        include: {
          guest: { select: { name: true, imageUrl: true } },
          host: { select: { name: true, imageUrl: true, league: true, country: true, stadium: true } },
        },
      }),
    );

    const allMatches = await Promise.all([...matchesPromises, ...stadiumMatchesPromises]);

    const favouriteMatches = allMatches.flat();

    const uniqueData = favouriteMatches
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .filter((item, index, self) => self.findIndex((selfItem) => selfItem.id === item.id) === index);

    return { data: uniqueData, count: uniqueData.length };
  }
}
