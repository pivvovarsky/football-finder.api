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

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GlobalModule,
  ],
  controllers: [AppController],
  providers: [FirebaseStorageService, FirebaseAuthService, FirebaseService, AppService],
})
export class AppModule {}
