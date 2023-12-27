import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateStadiumDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  @MaxLength(200)
  description: string | null;

  @IsString()
  @MaxLength(50)
  teamName: string;

  @IsString()
  websiteUrl: string | null;

  @IsString()
  @MaxLength(50)
  country: string;

  @IsString()
  @MaxLength(50)
  league: string;
}
