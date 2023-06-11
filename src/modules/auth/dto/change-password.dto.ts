import { IsNotEmpty, IsString, MinLength, MaxLength, Matches } from "class-validator";

const strongPasswordRegExp = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(150)
  @Matches(strongPasswordRegExp, { message: "password too weak" })
  password: string;
}
