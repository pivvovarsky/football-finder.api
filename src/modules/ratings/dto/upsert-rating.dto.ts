import { IsInt } from "class-validator";

export class UpsertRatingDto {
  @IsInt()
  rating: number;
}
