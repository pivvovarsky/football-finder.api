import { ApiProperty } from "@nestjs/swagger";

export class UserModel {
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
