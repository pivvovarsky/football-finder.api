import { ApiProperty } from "@nestjs/swagger";

export class StadiumImageModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  imageUrl: string | null;
}
