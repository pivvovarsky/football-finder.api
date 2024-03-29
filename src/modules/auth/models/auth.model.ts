import { ApiProperty } from "@nestjs/swagger";

export class AuthModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  newsletterSubscribed: boolean;
}
