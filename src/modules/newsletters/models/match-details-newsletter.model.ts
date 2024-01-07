import { PickType } from "@nestjs/swagger";
import { MatchItem } from "src/modules/matches/models/match-item.model";
import { StadiumItem } from "src/modules/stadiums/models/stadium-item.model";
import { TeamNameItem } from "src/modules/teams/models/team-name-item.model";
class StadiumName extends PickType(StadiumItem, ["name"] as const) {}

class HostItemDetails extends TeamNameItem {
  stadium: StadiumName | null;
}

export class MatchDetailsNewsletterModel extends MatchItem {
  host: HostItemDetails;
  guest: TeamNameItem;
}
