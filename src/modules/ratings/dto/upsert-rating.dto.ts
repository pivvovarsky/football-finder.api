import { IsInt, Max } from "class-validator";

export class UpsertRatingDto {
  @IsInt()
  @Max(5)
  rating: number;
}
