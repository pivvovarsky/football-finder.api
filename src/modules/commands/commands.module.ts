/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";
import { GenerateFakeData } from "./generate-fake-data.command";
import { AppModule } from "../app/app.module";

@Module({
  imports: [AppModule],
  controllers: [],
  providers: [GenerateFakeData],
})
export class CommandsModule {}
