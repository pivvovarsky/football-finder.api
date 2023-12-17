import { Logger, NotFoundException } from "@nestjs/common";
import * as dayjs from "dayjs";
import { Command, CommandRunner } from "nest-commander";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
// command to run script:  npm run generate-fake-data
interface Team {
  name: string;
  description?: string;
  league: string;
  country: string;
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
  constructor(private prismaService: MongoPrismaService, private logger: Logger) {
    super();
  }

  async generateTeamsWithStadiums() {
    for (let i = 0; i < DATA_QUANTITY; i++) {
      const teamData: Team = {
        name: `Team ${i}`,
        description: `Description of Team ${i}`,
        league: `league ${i}`,
        country: ` country ${i}`,
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

    for (let index = 0; index < users.length; index++) {
      Promise.all([
        this.prismaService.favoriteStadium.create({
          data: {
            stadiumId: stadiums[index].id,
            userId: users[index].id,
          },
        }),
        this.prismaService.favoriteTeam.create({
          data: {
            teamId: teams[index].id,
            userId: users[index].id,
          },
        }),
      ]);
    }
  }

  async run() {
    this.logger.log("starting generateTeamsWithStadiums!");
    await this.generateTeamsWithStadiums()
      .then(() => console.log("completed generateTeamsWithStadiums!\n"))
      .catch((err) => console.error(err));

    this.logger.log("starting generateMatches!");
    await this.generateMatches()
      .then(() => console.log("completed generateMatches!\n"))
      .catch((err) => console.error(err));

    this.logger.log("starting likeStadiumsMacthesTeamsByUsers!");
    await this.likeStadiumsMacthesTeamsByUsers()
      .then(() => console.log("completed likeStadiumsMacthesTeamsByUsers!\n"))
      .catch((err) => console.error(err));

    this.logger.log("Data generation completed!");
  }
}
