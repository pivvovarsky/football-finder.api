import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateTeamDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description?: string;
}
