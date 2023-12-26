import { ApiProperty } from "@nestjs/swagger";
import { extend } from "dayjs";
import { Match, Team } from "src/generated/prisma/client/mongo";

export class MatchItem implements Match {
  @ApiProperty()
  id: string;

  @ApiProperty()
  hostId: string;

  @ApiProperty()
  guestId: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
