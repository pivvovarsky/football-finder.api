import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
