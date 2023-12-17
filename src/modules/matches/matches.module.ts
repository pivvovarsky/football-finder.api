import { MatchesController } from "./matches.controller";
import { MatchesService } from "./matches.service";
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
