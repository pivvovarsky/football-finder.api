import { ApiProperty } from "@nestjs/swagger";

export class SubscribeNewsletterModel {
  @ApiProperty()
  newsletterSubscribed: boolean;
}
