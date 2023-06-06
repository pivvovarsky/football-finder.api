import { FirebaseStorageService } from "./../../common/services/firebase/firebase-storage.service";
import { FirebaseAuthService } from "./../../common/services/firebase/firebase-auth.service";
import { FirebaseService } from "./../../common/services/firebase/firebase.service";
import { AuthModule } from "./../auth/auth.module";
import { GlobalModule } from "../../common/module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import configuration from "src/config/configuration";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
// import { FirebaseGuard } from "src/common/guards";
import { MailerModule } from "@nestjs-modules/mailer";
import { ApiConfigService } from "src/common/services";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import { join } from "path";
import { FirebaseErrorInterceptor } from "src/common/interceptors";
import { FirebaseExceptionsFilter, PrismaExceptionsFilter } from "src/common/filteres";

@Module({
  imports: [
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
    // { provide: APP_GUARD, useClass: FirebaseGuard },
  ],
})
export class AppModule {}
