import { ApiProperty } from "@nestjs/swagger";

export class User {
  @ApiProperty()
  uid: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
