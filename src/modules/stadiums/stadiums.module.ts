import { StadiumsController } from "./stadiums.controller";
import { StadiumsService } from "./stadiums.service";

import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [StadiumsController],
  providers: [StadiumsService],
})
export class StadiumsModule {}
