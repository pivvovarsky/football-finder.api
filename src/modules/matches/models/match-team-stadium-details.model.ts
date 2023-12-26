import { ApiProperty } from "@nestjs/swagger";
class StadiumDetails {
  id: string;
  imageUrl: string | null;
  websiteUrl: string | null;
  name: string;
  latitude: number;
  longitude: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  teamId: string;
}
class TeamDetails {
  name: string;
  imageUrl: string | null;
  league: string;
  country: string;
  stadium: StadiumDetails | null;
}
export class MatchItemTeamStadiumDetails {
  @ApiProperty()
  id: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  host: TeamDetails;

  @ApiProperty()
  guest: TeamDetails;
}
