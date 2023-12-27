import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateTeamDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  league?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  country?: string;
}
