import { Logger, NotFoundException } from "@nestjs/common";
import * as dayjs from "dayjs";
import { Command, CommandRunner } from "nest-commander";
import { FirebaseService } from "src/common/services/firebase/firebase.service";
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
@Command({ name: "delete-users", description: "Delete users from MongoDB and Firebase" })
export class DeleteUsers extends CommandRunner {
  constructor(
    private prismaService: MongoPrismaService,
    private firebaseService: FirebaseService,
    private logger: Logger,
  ) {
    super();
  }

  async deleteUsers() {
    const prismaUsers = await this.prismaService.user.findMany({});
    const usersUids: string[] = [];

    for (const user of prismaUsers) {
      usersUids.push(user.id);
      await Promise.all([
        this.prismaService.favoriteStadium.deleteMany({
          where: { userId: user.id },
        }),
        this.prismaService.favoriteTeam.deleteMany({
          where: { userId: user.id },
        }),
      ]);
    }
    const xd = await this.prismaService.user.deleteMany({
      where: { id: { in: usersUids } },
    });

    const result = await this.firebaseService.auth.deleteUsers(usersUids);

    console.log("deleted users uids:", usersUids, "result:", result);
  }

  // async likeStadiumsMacthesTeamsByUsers() {
  //   const [users, matches, stadiums, teams] = await Promise.all([
  //     this.prismaService.user.findMany({}),
  //     this.prismaService.match.findMany({}),
  //     this.prismaService.stadium.findMany({}),
  //     this.prismaService.team.findMany({}),
  //   ]);

  //   for (let index = 0; index < users.length; index++) {
  //     Promise.all([
  //       this.prismaService.favoriteMatch.create({
  //         data: {
  //           matchId: matches[index].id,
  //           userId: users[index].id,
  //         },
  //       }),
  //       this.prismaService.favoriteStadium.create({
  //         data: {
  //           stadiumId: stadiums[index].id,
  //           userId: users[index].id,
  //         },
  //       }),
  //       this.prismaService.favoriteTeam.create({
  //         data: {
  //           teamId: teams[index].id,
  //           userId: users[index].id,
  //         },
  //       }),
  //     ]);
  //   }
  // }

  async run() {
    this.logger.log("starting delete users from database!");
    // await this.generateTeamsWithStadiums()
    // .then(() => console.log("completed generateTeamsWithStadiums!\n"))
    // .catch((err) => console.error(err));
    await this.deleteUsers()
      .then(() => console.log("completed delete users!\n"))
      .catch((err) => console.error(err));
    // this.logger.log("starting generateMatches!");
    // await this.generateMatches()
    //   .then(() => console.log("completed generateMatches!\n"))
    //   .catch((err) => console.error(err));

    // this.logger.log("starting likeStadiumsMacthesTeamsByUsers!");
    // await this.likeStadiumsMacthesTeamsByUsers()
    //   .then(() => console.log("completed likeStadiumsMacthesTeamsByUsers!\n"))
    //   .catch((err) => console.error(err));

    console.log("Delete users from database completed!");
  }
}
