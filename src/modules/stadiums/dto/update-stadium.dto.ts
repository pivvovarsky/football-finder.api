import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateStadiumDto {
  @IsString()
  name: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsString()
  description: string | null;
}
