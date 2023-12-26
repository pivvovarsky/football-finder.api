import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsBoolean } from "class-validator";

export class GetSubscribeNewsletterModel {
  @ApiProperty()
  newsletterSubscribed: boolean;
}
