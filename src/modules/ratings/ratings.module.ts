import { RatingsController } from "./ratings.controller";
import { RatingsService } from "./ratings.service";
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [RatingsController],
  providers: [RatingsService],
})
export class RatingsModule {}
