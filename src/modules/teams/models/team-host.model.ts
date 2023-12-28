import { ApiProperty, OmitType } from "@nestjs/swagger";
import { TeamItem } from "./team-item.model";
import { StadiumNameAndWebsiteUrlModel } from "src/modules/stadiums/models/stadium-item.model";

class HostItem extends OmitType(TeamItem, ["createdAt", "updatedAt", "id"] as const) {}
export class HostItemWithStadiumDetails extends HostItem {
  @ApiProperty()
  stadium: StadiumNameAndWebsiteUrlModel | null;
}
