/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable } from "@nestjs/common";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { FavouriteDetails } from "./models/favourite-details.model";
import { Stadium, Team } from "src/generated/prisma/client/mongo";
import { ObjectId } from "mongodb";

@Injectable()
export class FavouritesService {
  constructor(private prismaService: MongoPrismaService) {}

  private isValidID(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(
        "Invalid ID - ObjectID: provided hex string representation must be exactly 12 bytes",
      );
    }
  }

  async unlikeTeam(userId: string, teamId: string): Promise<FavouriteDetails> {
    this.isValidID(teamId);
    const favTeam = await this.prismaService.favouriteTeam.findFirstOrThrow({
      where: {
        userId,
        teamId,
      },
    });

    await this.prismaService.favouriteTeam.delete({ where: { id: favTeam.id } });

    return { liked: false };
  }

  async likeTeam(userId: string, teamId: string): Promise<FavouriteDetails> {
    this.isValidID(teamId);
    await this.prismaService.favouriteTeam.create({
      data: {
        userId,
        teamId,
      },
    });

    return { liked: true };
  }

  async unlikeStadium(userId: string, stadiumId: string): Promise<FavouriteDetails> {
    this.isValidID(stadiumId);
    const favSt = await this.prismaService.favouriteStadium.findFirstOrThrow({
      where: {
        userId,
        stadiumId,
      },
    });

    await this.prismaService.favouriteStadium.delete({ where: { id: favSt.id } });

    return { liked: false };
  }

  async likeStadium(userId: string, stadiumId: string): Promise<FavouriteDetails> {
    this.isValidID(stadiumId);
    await this.prismaService.favouriteStadium.create({
      data: {
        userId,
        stadiumId,
      },
    });

    return { liked: true };
  }

  async getFavouriteTeams(userId: string): Promise<Team[]> {
    return this.prismaService.team.findMany({
      where: { favouriteTeam: { some: { userId: userId } } },
    });
  }

  async getFavouriteTeamsCount(userId: string): Promise<number> {
    return this.prismaService.team.count({
      where: { favouriteTeam: { some: { userId: userId } } },
    });
  }

  async getFavouriteStadiums(userId: string): Promise<Stadium[]> {
    return this.prismaService.stadium.findMany({
      where: { favouriteStadium: { some: { userId: userId } } },
    });
  }

  async getFavouriteStadiumsCount(userId: string): Promise<number> {
    return this.prismaService.stadium.count({
      where: { favouriteStadium: { some: { userId: userId } } },
    });
  }

  async favouriteStadium(userId: string, stadiumId: string): Promise<FavouriteDetails> {
    this.isValidID(stadiumId);
    const alreadyLiked = await this.prismaService.favouriteStadium.findFirst({
      where: {
        userId,
        stadiumId,
      },
    });

    return alreadyLiked ? await this.unlikeStadium(userId, stadiumId) : await this.likeStadium(userId, stadiumId);
  }

  async favouriteTeam(userId: string, teamId: string): Promise<FavouriteDetails> {
    this.isValidID(teamId);
    const alreadyLiked = await this.prismaService.favouriteTeam.findFirst({
      where: {
        userId,
        teamId,
      },
    });

    return alreadyLiked ? await this.unlikeTeam(userId, teamId) : await this.likeTeam(userId, teamId);
  }

  async getFavouriteStadium(uuid: string, stadiumid: string): Promise<FavouriteDetails> {
    this.isValidID(stadiumid);
    const stadium = await this.prismaService.stadium.findFirst({ where: { id: stadiumid } });
    const user = await this.prismaService.user.findFirstOrThrow({ where: { id: uuid } });

    const alreadyLiked = await this.prismaService.favouriteStadium.findFirst({
      where: {
        userId: uuid,
        stadiumId: stadium?.id,
        user: user,
      },
    });

    return { liked: !!alreadyLiked };
  }

  async getFavouriteTeam(uuid: string, teamId: string): Promise<FavouriteDetails> {
    this.isValidID(teamId);
    const team = await this.prismaService.team.findFirst({ where: { id: teamId } });
    const alreadyLiked = await this.prismaService.favouriteTeam.findFirst({
      where: {
        userId: uuid,
        teamId: team?.id,
      },
    });

    return { liked: !!alreadyLiked };
  }
}
