import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateStadiumDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsString()
  @IsOptional()
  websiteUrl?: string | null;
}
