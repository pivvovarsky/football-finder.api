import { ApiProperty } from "@nestjs/swagger";
import { Team as TeamModel } from "src/generated/prisma/client/mongo";

export class TeamItem implements TeamModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imageUrl: string | null;

  @ApiProperty()
  league: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
