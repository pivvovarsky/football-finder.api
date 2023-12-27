/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { MongoPrismaService } from "src/common/services/mongo-prisma.service";
import { GetSubscribeNewsletterModel } from "./models/get-subscribe-newsletter.model";
import { Match, Prisma, User } from "src/generated/prisma/client/mongo";
import * as dayjs from "dayjs";
import { MailerService } from "@nestjs-modules/mailer";
import { MatchItemTeamStadiumDetails } from "../matches/models/match-team-stadium-details.model";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class NewslettersService {
  constructor(
    private prismaService: MongoPrismaService,
    private mailerService: MailerService,
    private logger: Logger,
  ) {}

  public async subscribeNewsletter(userUid: string, newsletterSubscribed: boolean): Promise<void> {
    const user = await this.prismaService.user.findUnique({ where: { id: userUid } });
    if (!user) throw new NotFoundException("User not found");

    const userData: Omit<User, "id" | "newsletterSubscribed"> = {
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    await this.prismaService.user.update({ where: { id: userUid }, data: { ...userData, newsletterSubscribed } });
  }

  public async getMySubscription(userUid: string): Promise<GetSubscribeNewsletterModel> {
    const user = await this.prismaService.user.findUnique({ where: { id: userUid } });
    if (!user) throw new NotFoundException("User not found");

    return { newsletterSubscribed: user.newsletterSubscribed };
  }

  private async getFavouriteMatchesThisMonth(userUid: string) {
    if (!userUid) throw new BadRequestException("Enter correct userUid");

    const [favouriteTeams, favouriteStadiums] = await Promise.all([
      this.prismaService.favoriteTeam.findMany({ where: { userId: userUid } }),
      this.prismaService.favoriteStadium.findMany({ where: { userId: userUid } }),
    ]);

    const favouriteMatches: MatchItemTeamStadiumDetails[] = [];
    const today = new Date();
    const lastDayOfMonth = dayjs().add(1, "M").endOf("month").toDate();
    for (const favTeam of favouriteTeams) {
      const favMatches = await this.prismaService.match.findMany({
        where: {
          OR: [{ hostId: favTeam.teamId }, { guestId: favTeam.teamId }],
          date: { gte: today, lte: lastDayOfMonth },
        },
        include: {
          guest: {
            select: {
              name: true,
              imageUrl: true,
              league: true,
              country: true,
              stadium: true,
            },
          },
          host: {
            select: {
              name: true,
              imageUrl: true,
              league: true,
              country: true,
              stadium: true,
            },
          },
        },
      });
      if (favMatches.length > 0) favouriteMatches.push(...favMatches);
    }

    for (const favStadium of favouriteStadiums) {
      const favMatch = await this.prismaService.match.findMany({
        where: { host: { stadium: { id: favStadium.stadiumId } }, date: { gte: today } },
        orderBy: { date: "asc" },
        include: {
          guest: {
            select: {
              name: true,
              imageUrl: true,
              league: true,
              country: true,
              stadium: true,
            },
          },
          host: {
            select: {
              name: true,
              imageUrl: true,
              league: true,
              country: true,
              stadium: true,
            },
          },
        },
      });

      if (favMatch.length > 0) favouriteMatches.push(...favMatch);
    }

    const uniqueData = favouriteMatches
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .filter((item, index, self) => self.findIndex((selfItem) => selfItem.id === item.id) === index);

    return { data: uniqueData, count: uniqueData.length };
  }

  // 0 oznacza na początku każdej godziny (minuta 0).
  // 12 oznacza godzinę 12 (południe).
  // 1 oznacza pierwszy dzień każdego miesiąca.
  // Pierwszy * oznacza każdy miesiąc.
  // Drugi * oznacza dowolny dzień tygodnia.
  @Cron("0 12 1 * *")
  public async sendNewsletter(): Promise<void> {
    const usersWithNewsletterSubscribed = await this.prismaService.user.findMany({
      where: { newsletterSubscribed: true },
      include: { favoriteTeams: true, favoriteStadiums: true },
    });
    const monthFullName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date());
    for (const user of usersWithNewsletterSubscribed) {
      if (user.newsletterSubscribed) {
        const upcomingMatches = await this.getFavouriteMatchesThisMonth(user.id);
        const formattedMatches = upcomingMatches.data.map((match) => ({
          host: { name: match.host.name },
          guest: { name: match.guest.name },
          date: dayjs(match.date).format("DD/MM/YYYY, HH:mm").toString(),
          stadium: { name: match.host.stadium?.name },
        }));

        await this.mailerService
          .sendMail({
            to: user.email,
            subject: `Football Finder - Monthly newsletter - ${monthFullName}`,
            template: "newsletter",
            context: {
              name: user.email,
              matches: formattedMatches,
            },
          })
          .then(() => {
            this.logger.debug("mail sent", user.email);
          })
          .catch((error) => {
            this.logger.error("error", error);
          });
      }
    }
  }
}
