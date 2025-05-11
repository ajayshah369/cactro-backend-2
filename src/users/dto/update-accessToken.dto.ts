import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator';

export class UpdateAccessTokenDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['bearer'])
  token_type: string;

  @IsDateString()
  @IsNotEmpty()
  expires_in: string;

  @IsString()
  @IsNotEmpty()
  refresh_token: string;

  @IsString()
  @IsNotEmpty()
  scope: string;
}
