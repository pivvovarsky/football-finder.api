import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { Stadium } from "src/generated/prisma/client/mongo";

export class StadiumItem implements Stadium {
  @ApiProperty()
  id: string;

  @ApiProperty()
  imageUrl: string | null;

  @ApiProperty()
  websiteUrl: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  teamId: string;
}
