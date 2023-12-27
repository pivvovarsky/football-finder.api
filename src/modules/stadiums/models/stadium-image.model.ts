import { ApiProperty } from "@nestjs/swagger";

export class StadiumImageModel {
  @ApiProperty()
  teamId: string;

  @ApiProperty()
  imageUrl: string | null;
}
