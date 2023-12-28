import { ApiProperty, OmitType } from "@nestjs/swagger";
import { TeamItem } from "./team-item.model";
import { StadiumName } from "src/modules/stadiums/models/stadium-item.model";

export class HostItem extends OmitType(TeamItem, ["createdAt", "updatedAt", "id"] as const) {}
export class HostItemWithStadiumName extends HostItem {
  @ApiProperty()
  stadium: StadiumName;
}
