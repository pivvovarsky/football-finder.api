import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTeamDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsString()
  league: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}
