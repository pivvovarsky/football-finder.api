import { ApiProperty } from "@nestjs/swagger";
import { Rating } from "src/generated/prisma/client/mongo";

export class RatingItem implements Rating {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  stadiumId: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
