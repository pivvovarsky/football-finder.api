import { ApiProperty, PickType } from "@nestjs/swagger";
import { TeamItem } from "src/modules/teams/models/team-item.model";
import { MatchItem } from "src/modules/matches/models/match-item.model";

class NextMatchTeamModel extends PickType(TeamItem, ["name"] as const) {}

export class NextMatchModel extends MatchItem {
  @ApiProperty()
  host: NextMatchTeamModel;

  @ApiProperty()
  guest: NextMatchTeamModel;
}
