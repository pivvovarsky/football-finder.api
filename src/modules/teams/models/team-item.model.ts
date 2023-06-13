import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Stadium, Team as TeamModel } from "src/generated/prisma/client/mongo";

export class TeamItem implements TeamModel {
  @ApiProperty()
  description: string | null;

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  stadiumId: string;

  @ApiProperty()
  imageUrl: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  stadium: Stadium;
}
