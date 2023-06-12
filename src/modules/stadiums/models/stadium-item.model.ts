import { ApiProperty } from "@nestjs/swagger";
import { Stadium } from "src/generated/prisma/client/mongo";

export class StadiumItem implements Stadium {
  @ApiProperty()
  teamId: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  information: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
