import { IsNotEmpty, IsBoolean } from "class-validator";

export class SubscribeNewsletterDto {
  @IsNotEmpty()
  @IsBoolean()
  newsletterSubscribed: boolean;
}
