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
import { FirebaseErrorInterceptor } from "src/common/interceptors";
import { ApiConfigService } from "src/common/services/api-config.service";
import { PrismaExceptionsFilter } from "src/common/filteres/prisma-exception.filter";
import { FirebaseExceptionsFilter } from "src/common/filteres/firebase-exception.filter";
import { AllExceptionsFilter } from "src/common/filteres/all-exception.filter";

@Module({
  imports: [
    TeamsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    // {
    //   provide: APP_FILTER,
    //   useClass: PrismaExceptionsFilter,
    // },
  ],
})
export class AppModule {}
