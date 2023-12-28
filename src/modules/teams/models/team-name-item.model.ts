import { PickType } from "@nestjs/swagger";
import { TeamItem } from "./team-item.model";

export class TeamNameItem extends PickType(TeamItem, ["name"] as const) {}
