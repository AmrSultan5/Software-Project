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
    responses_id: string;
  
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

   
    @IsOptional()
    @IsDateString()
    created_at: Date;
  
  }  