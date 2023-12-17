import { ApiProperty } from "@nestjs/swagger";
import { Team as TeamModel } from "src/generated/prisma/client/mongo";
import { StadiumItem } from "src/modules/stadiums/models/stadium-item.model";

export class TeamItem implements TeamModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  imageUrl: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  stadium: StadiumItem | null;

  @ApiProperty()
  league: string;

  @ApiProperty()
  country: string;
}
