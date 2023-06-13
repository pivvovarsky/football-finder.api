import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class PatchTeamImageDto {
  @ApiProperty({ type: "string", format: "binary", required: true })
  file: string;
}
