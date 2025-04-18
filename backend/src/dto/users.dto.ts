import { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';
import { Types } from 'mongoose';

export class UserDto {
  @IsNumber()
  @IsNotEmpty()
  readonly user_id: number;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
  

  @IsEnum(['student', 'instructor', 'admin'])
  @IsNotEmpty()
  readonly role: string;

  @IsArray()
  @IsOptional()
  readonly coursesTaught?: Types.ObjectId[];

  @IsArray()
  @IsOptional()
  readonly coursesEnrolled?: Types.ObjectId[];

  @IsString()
  @IsOptional()
  readonly profile_picture_url?: string;
}
