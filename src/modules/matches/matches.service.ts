/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable } from "@nestjs/common";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { Match } from "src/generated/prisma/client/mongo";
import { CreateMatchDto } from "./dto/create-match.dto";
import { MatchItem } from "./models/match-item.model";
import { UpcomingMatchItem } from "./models/upcoming-match-item.model";

const MAX_SIZE = 2;
@Injectable()
export class MatchesService {
  constructor(private mongoPrismaService: MongoPrismaService) {}

  public async createOne(data: CreateMatchDto): Promise<MatchItem> {
    if (data.hostId === data.guestId) throw new BadRequestException("Host and Guest cannot be the same");
    const [host, guest] = await Promise.all([
      this.mongoPrismaService.team.findUnique({ where: { id: data.hostId } }),
      this.mongoPrismaService.team.findUnique({ where: { id: data.guestId } }),
    ]);

    if (!host || !guest) throw new BadRequestException("Host or Guest not found");

    return await this.mongoPrismaService.match.create({ data });
  }

  public async getMany() {
    const data = await this.mongoPrismaService.match.findMany({});
    const count = await this.mongoPrismaService.match.count();
    return { data, count };
  }

  public async getFavouriteMatches(userUid: string) {
    if (!userUid) throw new BadRequestException("Enter correct userUid");

    const [favouriteTeams, favouriteStadiums] = await Promise.all([
      this.mongoPrismaService.favoriteTeam.findMany({ where: { userId: userUid } }),
      this.mongoPrismaService.favoriteStadium.findMany({ where: { userId: userUid } }),
    ]);

    const favouriteMatches: UpcomingMatchItem[] = [];
    const today = new Date();
    for (const favTeam of favouriteTeams) {
      const favMatches = await this.mongoPrismaService.match.findMany({
        take: MAX_SIZE,
        where: { OR: [{ hostId: favTeam.teamId }, { guestId: favTeam.teamId }], date: { gte: today } },
        orderBy: { date: "asc" },
        include: {
          guest: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
          host: {
            select: {
              name: true,
              imageUrl: true,
              league: true,
              country: true,
              stadium: { select: { name: true, websiteUrl: true } },
            },
          },
        },
      });
      if (favMatches.length > 0) favouriteMatches.push(...favMatches);
    }

    for (const favStadium of favouriteStadiums) {
      const favMatch = await this.mongoPrismaService.match.findMany({
        where: { host: { stadium: { id: favStadium.stadiumId } }, date: { gte: today } },
        take: MAX_SIZE,
        orderBy: { date: "asc" },
        include: {
          guest: {
            select: {
              name: true,
              imageUrl: true,
            },
          },
          host: {
            select: {
              name: true,
              imageUrl: true,
              league: true,
              country: true,
              stadium: { select: { name: true, websiteUrl: true } },
            },
          },
        },
      });

      if (favMatch.length > 0) favouriteMatches.push(...favMatch);
    }

    const uniqueData = favouriteMatches
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .filter((item, index, self) => self.findIndex((selfItem) => selfItem.id === item.id) === index);

    return { data: uniqueData, count: uniqueData.length };
  }
}
