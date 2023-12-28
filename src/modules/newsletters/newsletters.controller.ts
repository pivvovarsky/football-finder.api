/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Patch, Post, Put } from "@nestjs/common";
import { NewslettersService } from "./newsletters.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";
import { AuthPayload } from "../auth/models/auth-payload.model";
import { User } from "src/common/decorators/user.decorator";
import { ApiKeyGuard } from "src/common/decorators/guards/api-key.decorator";
import { SubscribeNewsletterDto } from "./dto/subscribe-newsletter.dto";
import { SubscribeNewsletterModel } from "./models/subscribe-newsletter.model";

@ApiTags("newsletters")
@Controller("newsletters")
export class NewslettersController {
  constructor(private newslettersSerivce: NewslettersService) {}

  @FirebaseJWTGuard()
  @ApiOperation({ summary: "Get information about the user's subscription." })
  @Get("me/subscription")
  async getMySubscription(@User() user: AuthPayload): Promise<SubscribeNewsletterModel> {
    return await this.newslettersSerivce.getMySubscription(user.uid);
  }

  @FirebaseJWTGuard()
  @ApiOperation({ summary: "User subscription to the newsletter" })
  @Patch("me/subscription")
  async subscribeNewsletter(@User() user: AuthPayload, @Body() body: SubscribeNewsletterDto): Promise<void> {
    this.newslettersSerivce.subscribeNewsletter(user.uid, body.newsletterSubscribed);
  }

  @ApiKeyGuard()
  @ApiOperation({ summary: "Manual sending of newsletters to users" })
  @Post()
  async sendNewsletterToUsers(): Promise<void> {
    await this.newslettersSerivce.sendNewsletter();
  }
}
