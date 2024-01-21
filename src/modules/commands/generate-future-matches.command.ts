import { Logger } from "@nestjs/common";
import { Command, CommandRunner } from "nest-commander";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { MatchesService } from "../matches/matches.service";
import { faker } from "@faker-js/faker";
import * as dayjs from "dayjs";
import { CreateMatchDto } from "../matches/dto/create-match.dto";

// command to run script:  npm run generate-future-matches

@Command({ name: "generate-future-matches", description: "Creates matches in the near future" })
export class GenerateFutureMatches extends CommandRunner {
  constructor(
    private prismaService: MongoPrismaService,
    private matchesService: MatchesService,
    private logger: Logger,
  ) {
    super();
  }

  async generateFutureMatches() {
    try {
      const tomorrow = dayjs().add(1, "d").toDate();
      const endDate = dayjs().add(10, "d").toDate();
      // Get available teams
      const teams = await this.prismaService.team.findMany({});
      const teamIds = teams.map((team) => team.id);

      if (teamIds.length < 2) {
        throw new Error("Need at least 2 teams to generate a match");
      }

      const matches: CreateMatchDto[] = [];

      for (let i = 0; i < 10; i++) {
        // Randomly choose indexes
        let [hostIndex, guestIndex] = [0, 0];
        do {
          hostIndex = Math.floor(Math.random() * teamIds.length);
          guestIndex = Math.floor(Math.random() * teamIds.length);
        } while (hostIndex === guestIndex);

        // Add new match
        matches.push({
          hostId: teamIds[hostIndex],
          guestId: teamIds[guestIndex],
          date: faker.date.between({ from: tomorrow, to: endDate }),
        });
        console.log(`added match number ${i + 1}`);
      }

      await this.matchesService.createMany(matches);
    } catch (error) {
      console.error(error);
    }
  }

  async run() {
    this.logger.log("starting generateFutureMatches!");

    await this.generateFutureMatches()
      .then(() => console.log("completed generateFutureMatches!\n"))
      .catch((err) => console.error(err));

    console.log("generateFutureMatches completed!");
  }
}
