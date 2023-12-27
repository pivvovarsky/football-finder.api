import { ApiProperty } from "@nestjs/swagger";

export class AuthLoginModel {
  @ApiProperty()
  email: string;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  token: string;
}
