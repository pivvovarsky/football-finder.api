/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, Put } from "@nestjs/common";
import { AuthPayload } from "../auth/models/auth-payload.model";
import { User } from "src/common/decorators/user.decorator";
import { FavouritesService } from "./favourites.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { FirebaseJWTGuard } from "src/common/decorators/guards/firebase.decorator";
import { ListResponse } from "src/common/decorators/list-response.decorator";
import { StadiumItem } from "../stadiums/models/stadium-item.model";
import { TeamItem } from "../teams/models/team-item.model";
import { FavouriteDetails } from "./models/favourite-details.model";
@FirebaseJWTGuard()
@ApiTags("user-favourites")
@Controller("users")
export class FavouritesController {
  constructor(private favouritesService: FavouritesService) {}
  @Get("me/favourite-stadiums")
  @ListResponse(StadiumItem)
  async getMyFavouriteStadiums(@User() user: AuthPayload) {
    const [stadiumsList, stadiumsCount] = await Promise.all([
      this.favouritesService.getFavouriteStadiums(user.uid),
      this.favouritesService.getFavouriteStadiumsCount(user.uid),
    ]);

    return { count: stadiumsCount, data: stadiumsList };
  }

  @ListResponse(TeamItem)
  @Get("me/favourite-teams")
  async getMyFavouriteTeams(@User() user: AuthPayload) {
    const [teamsList, teamsCount] = await Promise.all([
      this.favouritesService.getFavouriteTeams(user.uid),
      this.favouritesService.getFavouriteTeamsCount(user.uid),
    ]);

    return { count: teamsCount, data: teamsList };
  }

  @Put("me/favourite-teams/:id")
  async likeTeam(@Param("id") id: string, @User() user: AuthPayload): Promise<FavouriteDetails> {
    return await this.favouritesService.favouriteTeam(user.uid, id);
  }

  @Put("me/favourite-stadiums/:id")
  async likeStadium(@Param("id") id: string, @User() user: AuthPayload): Promise<FavouriteDetails> {
    return await this.favouritesService.favouriteStadium(user.uid, id);
  }

  @Get("me/favourite-stadiums/:id")
  async getFavouriteStadium(@Param("id") id: string, @User() user: AuthPayload): Promise<FavouriteDetails> {
    return await this.favouritesService.getFavouriteStadium(user.uid, id);
  }

  @Get("me/favourite-teams/:id")
  async getFavouriteTeam(@Param("id") id: string, @User() user: AuthPayload): Promise<FavouriteDetails> {
    return await this.favouritesService.getFavouriteTeam(user.uid, id);
  }
}
