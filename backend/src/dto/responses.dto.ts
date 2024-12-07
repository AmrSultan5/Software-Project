import {
    IsNotEmpty,
    IsString,
    IsDateString,
    IsNumber,
    IsOptional,
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
    submitted_at: Date;
    static schema: any;
  
  }  