import { IsString, IsEmail, IsNotEmpty, IsOptional, IsEnum, IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty() // Ensures the field is not empty
  readonly user_id: string;

  @IsString()
  @IsNotEmpty() // Ensures the field is not empty
  readonly name: string;

  @IsEmail()
  @IsNotEmpty() // Ensures the field is not empty and a valid email
  readonly email: string;

  @IsString()
  @IsNotEmpty() // Ensures the field is not empty
  readonly password: string;

  @IsEnum(['student', 'instructor', 'admin'])
  @IsNotEmpty() // Ensures the field is not empty and matches the enum
  readonly role: string;

  @IsArray()
  @IsOptional() // Optional field for courses taught
  readonly coursesTaught?: Types.ObjectId[];

  @IsArray()
  @IsOptional() // Optional field for courses enrolled
  readonly coursesEnrolled?: Types.ObjectId[];

  @IsString()
  @IsOptional() // Optional field for profile picture URL
  readonly profile_picture_url?: string;
}
