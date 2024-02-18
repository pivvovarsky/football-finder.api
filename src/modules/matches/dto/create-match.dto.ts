import { IsDateString, IsMongoId, IsString } from "class-validator";

export class CreateMatchDto {
  @IsString()
  @IsMongoId()
  hostId: string;

  @IsMongoId()
  @IsString()
  guestId: string;

  @IsDateString()
  date: Date;
}
