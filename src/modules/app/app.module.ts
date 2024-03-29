import { UsersModule } from "./../users/users.module";
import { NewslettersService } from "../newsletters/newsletters.service";
import { NewslettersModule } from "./../newsletters/newsletters.module";
import { RatingsModule } from "./../ratings/ratings.module";
import { FavouritesModule } from "./../favourites/favourites.module";
import { MatchesModule } from "./../matches/matches.module";
import { StadiumsModule } from "../stadiums/stadiums.module";
import { TeamsModule } from "./../teams/teams.module";
import { AuthModule } from "./../auth/auth.module";
import { GlobalModule } from "../../common/module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import configuration from "src/config/configuration";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { join } from "path";
import { ApiConfigService } from "src/common/services/api-config.service";
import { PrismaExceptionsFilter } from "src/common/filteres/prisma-exception.filter";
import { FirebaseExceptionsFilter } from "src/common/filteres/firebase-exception.filter";
import { FirebaseErrorInterceptor } from "src/common/interceptors/firebase-error.interceptor";
import { ScheduleModule as CronModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CronModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ApiConfigService) => ({
        transport: configService.mailer.transport,
        defaults: configService.mailer.defaults,
        template: {
          dir: join(__dirname, "templates"),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
      inject: [ApiConfigService],
    }),
    GlobalModule,
    AuthModule,
    UsersModule,
    StadiumsModule,
    TeamsModule,
    MatchesModule,
    FavouritesModule,
    RatingsModule,
    NewslettersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: FirebaseExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: FirebaseErrorInterceptor,
    },
  ],
})
export class AppModule {}
