import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class AvgRatingStadium {
  @ApiProperty()
  @IsNumber()
  avgRating: number;
}
