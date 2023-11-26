/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";
import { GenerateFakeData } from "./generate-fake-data.command";
import { AppModule } from "../app/app.module";
import { DeleteUsers } from "./delete-users.command";

@Module({
  imports: [AppModule],
  controllers: [],
  providers: [GenerateFakeData, DeleteUsers],
})
export class CommandsModule {}
