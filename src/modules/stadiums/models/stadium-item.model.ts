import { ApiProperty } from "@nestjs/swagger";
import { Stadium } from "src/generated/prisma/client/mongo";

export class StadiumItem implements Stadium {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  teamId: string;
}
