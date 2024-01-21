/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Patch, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RatingsService } from "./ratings.service";
import { UpsertRatingDto } from "./dto/upsert-rating.dto";
import { User } from "src/common/decorators/user.decorator";
import { AuthPayload } from "../auth/models/auth-payload.model";
import { Rating } from "src/generated/prisma/client/mongo";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";
import { AvgRatingStadium } from "./models/average-rating-stadium.model";
import { RatingItem } from "./models/upsert-rating.model";
@FirebaseJWTGuard()
@ApiTags("ratings")
@Controller("ratings")
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Get("me/:stadiumId")
  async getMyRating(@User() user: AuthPayload, @Param("stadiumId") stadiumId: string): Promise<RatingItem | null> {
    return await this.ratingsService.getMyRating(user.uid, stadiumId);
  }

  @Patch("me/:stadiumId")
  async upsertRating(
    @User() user: AuthPayload,
    @Param("stadiumId") stadiumId: string,
    @Body() body: UpsertRatingDto,
  ): Promise<RatingItem> {
    return await this.ratingsService.upsertStadiumRating(user.uid, stadiumId, body.rating);
  }

  @Get(":stadiumId/average")
  async averageRatingStadium(@Param("stadiumId") stadiumId: string): Promise<AvgRatingStadium> {
    return await this.ratingsService.getAvgRatingStadium(stadiumId);
  }
}
