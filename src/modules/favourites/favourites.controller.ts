/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, Put } from "@nestjs/common";
import { AuthPayload } from "../auth/models/auth-payload.model";
import { User } from "src/common/decorators/user.decorator";
import { FavouritesService } from "./favourites.service";
import { ApiTags } from "@nestjs/swagger";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";
@FirebaseJWTGuard()
@ApiTags("user-favourites")
@Controller("users")
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
  async likeTeam(@Param("id") id: string, @User() user: AuthPayload) {
    return await this.favouritesService.favouriteTeam(user.uid, id);
  }

  @Put("me/favourite-stadiums/:id")
  async likeStadium(@Param("id") id: string, @User() user: AuthPayload) {
    return await this.favouritesService.favouriteStadium(user.uid, id);
  }

  @Get("me/favourite-stadiums/:id")
  async getFavouriteSession(@Param("id") id: string, @User() user: AuthPayload) {
    return await this.favouritesService.getFavouriteStadium(user.uid, id);
  }

  @Get("me/favourite-teams/:id")
  async getFavouriteTeam(@Param("id") id: string, @User() user: AuthPayload) {
    return await this.favouritesService.getFavouriteTeam(user.uid, id);
  }
}
