import { ApiProperty, OmitType } from "@nestjs/swagger";
import { StadiumItem } from "src/modules/stadiums/models/stadium-item.model";
import { TeamItem } from "./team-item.model";

export class TeamItemWithStadium extends TeamItem {
  @ApiProperty()
  stadium: StadiumItem | null;
}
