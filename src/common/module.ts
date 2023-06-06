import { Global, Logger, Module } from "@nestjs/common";
import { ApiConfigService, PrismaService } from "./services";
import { FirebaseService } from "./services/firebase/firebase.service";
import { FirebaseAuthService } from "./services/firebase/firebase-auth.service";
import { FirebaseStorageService } from "./services/firebase/firebase-storage.service";

@Global()
@Module({
  exports: [Logger, ApiConfigService, PrismaService, FirebaseService, FirebaseAuthService, FirebaseStorageService],
  providers: [Logger, ApiConfigService, PrismaService, FirebaseService, FirebaseAuthService, FirebaseStorageService],
})
export class GlobalModule {}
