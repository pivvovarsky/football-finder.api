import { ApiProperty } from "@nestjs/swagger";
import { MatchItem } from "./match-item.model";
import { GuestItem } from "src/modules/teams/models/team-guest.model";
import { HostItemWithStadiumName } from "src/modules/teams/models/team-host.model";

export class UpcomingMatchItem extends MatchItem {
  @ApiProperty()
  guest: GuestItem;

  @ApiProperty()
  host: HostItemWithStadiumName;
}
