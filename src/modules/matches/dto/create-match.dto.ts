import { IsDateString, IsString } from "class-validator";

export class CreateMatchDto {
  @IsString()
  hostId: string;

  @IsString()
  guestId: string;

  @IsDateString()
  date: Date;
}
