import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateStadiumDto {
  @IsString()
  hostId: string;

  @IsString()
  guestId: string;

  @IsDateString()
  @IsOptional()
  date?: Date;
}
