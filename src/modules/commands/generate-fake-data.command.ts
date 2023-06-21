import { NotFoundException } from "@nestjs/common";
import * as dayjs from "dayjs";
import { Command, CommandRunner } from "nest-commander";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
// command to run script:  npm run generate-fake-data
interface Team {
  name: string;
  description?: string;
}

interface Stadium {
  name: string;
  latitude: number;
  longitude: number;
}

const DATA_QUANTITY = 2;
const TODAY = dayjs().toDate();
@Command({ name: "generate-fake-data", description: "Generate fake data to mongo database" })
export class GenerateFakeData extends CommandRunner {
  constructor(private prismaService: MongoPrismaService) {
    super();
  }

  async generateTeamsWithStadiums() {
    for (let i = 0; i < DATA_QUANTITY; i++) {
      const teamData: Team = {
        name: `Team ${i}`,
        description: `Description of Team ${i}`,
      };
      const stadiumData: Stadium = {
        name: `Stadium of ${teamData.name}`,
        latitude: i,
        longitude: i,
      };
      await this.prismaService.team
        .create({ data: { ...teamData, stadium: { create: stadiumData } } })
        .catch((err) => console.error(err));
    }
  }

  async generateMatches() {
    const teams = await this.prismaService.team.findMany({}).catch((err) => console.error(err));

    for (let i = 0; i < DATA_QUANTITY; i++) {
      const hostStadium = await this.prismaService.stadium
        .findUnique({ where: { teamId: teams[i].id } })
        .catch((err) => console.error(err));
      if (hostStadium) {
        await this.prismaService.match
          .create({
            data: {
              hostId: teams[i].id,
              guestId: teams[i + 1].id,
              stadiumId: hostStadium?.id,
              guestGoals: i,
              hostGoals: i + 1,
              date: TODAY,
            },
          })
          .catch((error) => {
            console.error(error);
          });
      } else throw new NotFoundException();
    }
  }

  async likeStadiumsMacthesTeamsByUsers() {
    const [users, matches, stadiums, teams] = await Promise.all([
      this.prismaService.user.findMany({}),
      this.prismaService.match.findMany({}),
      this.prismaService.stadium.findMany({}),
      this.prismaService.team.findMany({}),
    ]);

    users.forEach(async (user, index) => {
      Promise.all([
        this.prismaService.favoriteMatch.create({
          data: {
            matchId: matches[index].id,
            userId: user.id,
          },
        }),
        this.prismaService.favoriteStadium.create({
          data: {
            stadiumId: stadiums[index].id,
            userId: user.id,
          },
        }),
        this.prismaService.favoriteTeam.create({
          data: {
            teamId: teams[index].id,
            userId: user.id,
          },
        }),
      ]);
    });
  }

  async run() {
    console.log("starting generateTeamsWithStadiums!");
    await this.generateTeamsWithStadiums().catch((err) => console.error(err));
    console.log("starting generateMatches!");
    await this.generateMatches().catch((err) => console.error(err));
    console.log("starting likeStadiumsMacthesTeamsByUsers!");
    await this.likeStadiumsMacthesTeamsByUsers().catch((err) => console.error(err));

    console.log("Data generation completed!");
  }
}