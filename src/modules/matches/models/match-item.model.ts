import { ApiProperty } from "@nestjs/swagger";
import { extend } from "dayjs";
import { Match, Team } from "src/generated/prisma/client/mongo";
import { TeamItemWithStadium } from "src/modules/teams/models/team-item-with-stadium.model";

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

export class MatchItemWithTeamDetails extends MatchItem {
  @ApiProperty()
  guest: TeamItemWithStadium;

  @ApiProperty()
  host: TeamItemWithStadium;
}
