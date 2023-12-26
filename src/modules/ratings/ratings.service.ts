/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ObjectId } from "mongodb";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { Rating } from "src/generated/prisma/client/mongo";
import { AvgRatingStadium } from "./models/average-rating-stadium.model";
import { RatingItem } from "./models/upsert-rating.model";

@Injectable()
export class RatingsService {
  constructor(private prismaService: MongoPrismaService) {}

  private isValidID(id: string) {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException(
        "Invalid ID - ObjectID: provided hex string representation must be exactly 12 bytes",
      );
    }
  }

  async getMyRating(userUid: string, stadiumId: string): Promise<RatingItem | null> {
    this.isValidID(stadiumId);
    const userRating = await this.prismaService.rating.findFirst({ where: { userId: userUid, stadiumId: stadiumId } });
    if (!userRating) return null;

    return { ...userRating };
  }

  async upsertStadiumRating(userUid: string, stadiumId: string, rating: number): Promise<RatingItem> {
    this.isValidID(stadiumId);

    if (rating > 5 || rating <= 0) throw new BadRequestException("Rating can only range from 1 to 5");

    const ratingExists = await this.prismaService.rating.findFirst({ where: { userId: userUid, stadiumId } });
    const ratingData = ratingExists
      ? await this.prismaService.rating.update({
          where: { id: ratingExists.id },
          data: {
            rating,
          },
        })
      : await this.prismaService.rating.create({
          data: {
            userId: userUid,
            stadiumId,
            rating,
          },
        });

    return { ...ratingData };
  }

  async getAvgRatingStadium(stadiumId: string): Promise<AvgRatingStadium> {
    this.isValidID(stadiumId);
    const ratings = await this.prismaService.rating.findMany({ where: { stadiumId } });
    const ratingsCount = await this.prismaService.rating.count({ where: { stadiumId } });
    const totalRatingsSum = ratings.reduce((acc, el) => {
      return acc + el.rating;
    }, 0);

    if (ratingsCount !== 0) return { avgRating: parseFloat((totalRatingsSum / ratingsCount).toFixed(2)) };
    return { avgRating: 0 };
  }
}
