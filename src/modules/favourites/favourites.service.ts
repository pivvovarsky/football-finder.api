/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common";
import { StadiumsService } from "../stadiums/stadiums.service";
import { TeamsService } from "../teams/teams.service";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { FavouriteDetails } from "./models/favourite-details.model";
import { TeamItem } from "../teams/models/team-item.model";
import { FavoriteTeam, Stadium, Team } from "src/generated/prisma/client/mongo";

@Injectable()
export class FavouritesService {
  constructor(
    private prismaService: MongoPrismaService,
    private stadiumsService: StadiumsService,
    private teamService: TeamsService,
  ) {}

  async unlikeTeam(userId: string, teamId: string): Promise<FavouriteDetails> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        favoriteTeams: {
          delete: { id: teamId },
        },
      },
    });

    return { liked: false };
  }

  async likeTeam(userId: string, teamId: string): Promise<FavouriteDetails> {
    await this.prismaService.favoriteTeam.create({
      data: {
        userId,
        teamId,
      },
    });

    return { liked: true };
  }

  async unlikeStadium(userId: string, stadiumId: string): Promise<FavouriteDetails> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        favoriteStadiums: {
          delete: { id: stadiumId },
        },
      },
    });

    return { liked: false };
  }

  async likeStadium(userId: string, stadiumId: string): Promise<FavouriteDetails> {
    await this.prismaService.favoriteStadium.create({
      data: {
        userId,
        stadiumId,
      },
    });

    return { liked: true };
  }

  async getFavouriteTeams(userId: string): Promise<Team[]> {
    return this.prismaService.team.findMany({
      where: { favoriteTeam: { some: { userId: userId } } },
    });
  }

  async getFavouriteTeamsCount(userId: string): Promise<number> {
    return this.prismaService.team.count({
      where: { favoriteTeam: { some: { userId: userId } } },
    });
  }

  async getFavouriteStadiums(userId: string): Promise<Stadium[]> {
    return this.prismaService.stadium.findMany({
      where: { FavoriteStadium: { some: { userId: userId } } },
    });
  }

  async getFavouriteStadiumsCount(userId: string): Promise<number> {
    return this.prismaService.stadium.count({
      where: { FavoriteStadium: { some: { userId: userId } } },
    });
  }

  async favouriteStadium(userId: string, stadiumId: string): Promise<FavouriteDetails> {
    const alreadyLiked = await this.prismaService.favoriteStadium.findUnique({
      where: {
        userId,
        stadiumId,
      },
    });

    return alreadyLiked ? await this.unlikeStadium(userId, stadiumId) : await this.likeStadium(userId, stadiumId);
  }

  async favouriteTeam(userId: string, teamId: string): Promise<FavouriteDetails> {
    const alreadyLiked = await this.prismaService.favoriteTeam.findUnique({
      where: {
        userId,
        teamId,
      },
    });

    return alreadyLiked ? await this.unlikeTeam(userId, teamId) : await this.likeTeam(userId, teamId);
  }
}
