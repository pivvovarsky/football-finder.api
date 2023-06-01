import { Global, Logger, Module } from "@nestjs/common";
import { ApiConfigService, PrismaService } from "./services";

@Global()
@Module({
  exports: [Logger, ApiConfigService, PrismaService],
  providers: [Logger, ApiConfigService, PrismaService],
})
export class GlobalModule {}
