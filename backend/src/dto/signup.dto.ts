import {
    IsNotEmpty,
    IsString,
    IsEnum,
    IsOptional,
    IsDateString,
    IsEmail,
    MinLength,
    IsUrl,
    IsMongoId,
  } from 'class-validator';
  
  export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;
  
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter a valid email address' })
    readonly email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    readonly password: string;
  
    @IsNotEmpty()
    @IsEnum(['student', 'instructor', 'admin'], {
      message: 'Role must be one of the following values: student, instructor, admin',
    })
    readonly role: string;
  
    @IsOptional()
    @IsUrl({}, { message: 'Please enter a valid URL for the profile picture' })
    readonly profile_picture_url?: string;
  
    @IsOptional()
    @IsMongoId({ each: true, message: 'Each courseTaught ID must be a valid ObjectId' })
    readonly coursesTaught?: string[];
  
    @IsOptional()
    @IsMongoId({ each: true, message: 'Each courseEnrolled ID must be a valid ObjectId' })
    readonly coursesEnrolled?: string[];
  
    @IsOptional()
    @IsDateString({}, { message: 'createdAt must be a valid ISO date string' })
    readonly createdAt?: string;
  }  