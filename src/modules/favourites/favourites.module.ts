import { StadiumsService } from "../stadiums/stadiums.service";
import { TeamsService } from "../teams/teams.service";
import { FavouritesController } from "./favourites.controller";
import { FavouritesService } from "./favourites.service";
/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [FavouritesController],
  providers: [FavouritesService, StadiumsService, TeamsService],
})
export class FavouritesModule {}
