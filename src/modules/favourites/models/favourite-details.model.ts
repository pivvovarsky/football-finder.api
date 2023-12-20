import { ApiProperty } from "@nestjs/swagger";

export class FavouriteDetails {
  @ApiProperty()
  liked: boolean;
}
