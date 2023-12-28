import { PickType } from "@nestjs/swagger";
import { TeamItem } from "./team-item.model";

export class GuestItem extends PickType(TeamItem, ["name", "imageUrl"] as const) {}
