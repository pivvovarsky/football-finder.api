import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMatchDto {
  @IsString()
  hostId: string;

  @IsString()
  guestId: string;

  @IsInt()
  @IsOptional()
  hostGoals?: number;

  @IsInt()
  @IsOptional()
  guestGoals?: number;

  @IsDateString()
  date: Date;
}
