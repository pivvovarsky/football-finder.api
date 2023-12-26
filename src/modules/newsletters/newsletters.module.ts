import { NewslettersController } from "./newsletters.controller";
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";
import { NewslettersService } from "./newsletters.service";
import { MatchesService } from "../matches/matches.service";

@Module({
  imports: [],
  controllers: [NewslettersController],
  providers: [NewslettersService],
})
export class NewslettersModule {}
