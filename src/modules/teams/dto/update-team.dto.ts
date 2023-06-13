import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateTeamDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  description?: string;
}
