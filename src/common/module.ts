import { Global, Logger, Module } from "@nestjs/common";
import { FirebaseService } from "./services/firebase/firebase.service";
import { FirebaseAuthService } from "./services/firebase/firebase-auth.service";
import { FirebaseStorageService } from "./services/firebase/firebase-storage.service";
import { MongoPrismaService } from "./services/mongo-prisma.service";
import { ApiConfigService } from "./services/api-config.service";

@Global()
@Module({
  exports: [Logger, ApiConfigService, MongoPrismaService, FirebaseService, FirebaseAuthService, FirebaseStorageService],
  providers: [
    Logger,
    ApiConfigService,
    MongoPrismaService,
    FirebaseService,
    FirebaseAuthService,
    FirebaseStorageService,
  ],
})
export class GlobalModule {}
