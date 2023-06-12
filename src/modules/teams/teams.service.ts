/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from "@nestjs/common";
import { MongoPrismaService } from "src/common/services";
import { Prisma, Team } from "src/generated/prisma/client/mongo";
import { TeamItem } from "./models";
import { CreateTeamDto } from "./dto";

@Injectable()
export class TeamsService {
  constructor(private mongoPrismaService: MongoPrismaService) {}

  public async create(data: Prisma.TeamCreateInput) {
    return await this.mongoPrismaService.team.create({ data });
  }
}
