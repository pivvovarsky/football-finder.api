/*
https://docs.nestjs.com/modules
*/

import { Module } from "@nestjs/common";
import { AppModule } from "../app/app.module";
import { DeleteUsers } from "./delete-users.command";

@Module({
  imports: [AppModule],
  controllers: [],
  providers: [DeleteUsers],
})
export class CommandsModule {}
