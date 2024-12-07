import {
    IsNotEmpty,
    IsString,
    IsDateString,
    IsNumber,
    IsOptional,
  } from 'class-validator';
  
  export class ResponseDto {
    @IsNotEmpty()
    @IsString()
    responses_id: string;
  
    @IsNotEmpty()
    @IsString()
    user_Id: string;
  
    @IsNotEmpty()
    @IsString()
    quiz_Id: string;
  
    @IsNotEmpty()
    @IsString()
    answers : object[];

    @IsNotEmpty()
    @IsNumber()
    score : number;

  
    @IsOptional()
    @IsDateString()
    submitted_at?: Date;
    static schema: any;
  
  }  