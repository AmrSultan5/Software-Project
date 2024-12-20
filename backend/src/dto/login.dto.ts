import {
    IsNotEmpty,
    IsString,
    IsEmail,
    MinLength
  } from 'class-validator';
  
  export class LoginDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter a valid email address' })
    readonly email: string;
  
    @IsNotEmpty()
    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    readonly password: string;
  }   