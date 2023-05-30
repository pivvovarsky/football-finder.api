import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GlobalModule } from "src/common/module";

@Module({
  imports: [GlobalModule],
  exports: [],
  providers: [],
})
export class WorkerModule {}
