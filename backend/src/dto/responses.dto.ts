import {
    IsNotEmpty,
    IsString,
    IsEnum,
    IsOptional,
    IsDateString,
    IsNumber,
  } from 'class-validator';
import { Types } from 'mongoose';
  
  export class ResponseDto {
    @IsNotEmpty()
    @IsString()
    responese_id: string;
  
    @IsNotEmpty()
    @IsString()
    user_Id: Types.ObjectId;
  
    @IsNotEmpty()
    @IsString()
    quiz_Id: Types.ObjectId;
  
    @IsNotEmpty()
    @IsString()
    answers : object[];

    @IsNotEmpty()
    @IsNumber()
    score : number;

  
    @IsNotEmpty()
    @IsDateString()
    submitted_at: Date;
    static schema: any;
  
  }  