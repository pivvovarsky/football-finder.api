import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
