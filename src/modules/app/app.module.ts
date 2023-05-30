import { GlobalModule } from "../../common/module";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [GlobalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
