import { ApiProperty } from "@nestjs/swagger";
import { extend } from "dayjs";
import { Match, Team } from "src/generated/prisma/client/mongo";
import { TeamItem } from "src/modules/teams/models/team-item.model";

export class MatchItem implements Match {
  @ApiProperty()
  id: string;

  @ApiProperty()
  hostId: string;

  @ApiProperty()
  guestId: string;

  @ApiProperty()
  hostGoals: number | null;

  @ApiProperty()
  guestGoals: number | null;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
