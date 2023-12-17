import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStadiumDto {
  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  description: string | null;

  @IsString()
  teamName: string;

  @IsString()
  websiteUrl: string | null;

  @IsString()
  country: string;

  @IsString()
  league: string;
}
