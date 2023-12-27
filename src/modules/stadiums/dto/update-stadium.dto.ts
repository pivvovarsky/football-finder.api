import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateStadiumDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description: string | null;

  @IsString()
  @IsOptional()
  websiteUrl?: string | null;
}
