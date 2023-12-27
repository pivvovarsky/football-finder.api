import { ApiProperty } from "@nestjs/swagger";

export class TeamImageModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  imageUrl: string | null;
}
