/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, Put } from "@nestjs/common";
import { AuthPayload } from "../auth/models/auth-payload.model";
import { User } from "src/common/decorators/user.decorator";
import { FavouritesService } from "./favourites.service";

@Controller()
export class FavouritesController {
  constructor(private favouritesService: FavouritesService) {}

  @Get("me/favourite-stadiums")
  async getMyFavouriteSessions(@User() user: AuthPayload) {
    const [stadiumsList, stadiumsCount] = await Promise.all([
      this.favouritesService.getFavouriteStadiums(user.uid),
      this.favouritesService.getFavouriteStadiumsCount(user.uid),
    ]);

    return { data: stadiumsList, count: stadiumsCount };
  }

  @Get("me/favourite-teams")
  async getMyFavouriteTeams(@User() user: AuthPayload) {
    const [teamsList, teamsCount] = await Promise.all([
      this.favouritesService.getFavouriteTeams(user.uid),
      this.favouritesService.getFavouriteTeamsCount(user.uid),
    ]);

    return { data: teamsList, count: teamsCount };
  }

  @Put("me/favourite-teams/:id")
  async likeSession(@Param("id") id: string, @User() user: AuthPayload) {
    return await this.favouritesService.favouriteTeam(user.uid, id);
  }

  @Put("me/favourite-stadiums/:id")
  async likePattern(@Param("id") id: string, @User() user: AuthPayload) {
    return await this.favouritesService.favouriteStadium(user.uid, id);
  }
}
