import { ApiProperty } from "@nestjs/swagger";
import { Match } from "src/generated/prisma/client/mongo";

class TeamDetails {
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

export class NextMatchModel implements Match {
  @ApiProperty()
  id: string;

  @ApiProperty()
  hostId: string;

  @ApiProperty()
  guestId: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  host: TeamDetails;

  @ApiProperty()
  guest: TeamDetails;
}
