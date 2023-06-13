import { ApiProperty } from "@nestjs/swagger";
import { Team as TeamModel } from "src/generated/prisma/client/mongo";

export class TeamDetails implements Pick<TeamModel, "imageUrl"> {
  @ApiProperty()
  imageUrl: string;
}
