/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";
import { AppModule } from "../app/app.module";
import { DeleteUsers } from "./delete-users.command";
import { MatchesService } from "../matches/matches.service";
import { GenerateFutureMatches } from "./generate-future-matches.command";
import { DeleteMatches } from "./delete-matches.command";

@Module({
  imports: [AppModule],
  controllers: [],
  providers: [DeleteUsers, GenerateFutureMatches, MatchesService, DeleteMatches],
})
export class CommandsModule {}
