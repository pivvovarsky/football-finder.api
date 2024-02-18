import { IsLatitude, IsLongitude, IsNumber, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateStadiumDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsNumber()
  @IsLatitude()
  latitude: number;

  @IsNumber()
  @IsLongitude()
  longitude: number;

  @IsString()
  @MaxLength(200)
  description: string;

  @IsString()
  @MaxLength(50)
  teamName: string;

  @IsString()
  @IsUrl()
  websiteUrl: string;

  @IsString()
  @MaxLength(50)
  country: string;

  @IsString()
  @MaxLength(50)
  league: string;
}
