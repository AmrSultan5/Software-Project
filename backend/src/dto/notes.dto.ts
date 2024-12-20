import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsDateString,
  } from 'class-validator';
  
  export class NoteDto {
    @IsNotEmpty()
    @IsString()
    note_id: string;
  
    @IsNotEmpty()
    @IsString()
    user_id: string;
  
    @IsOptional()
    @IsString()
    course_id?: string;
  
    @IsNotEmpty()
    @IsString()
    content: string;
  
    @IsOptional()
    @IsDateString()
    created_at?: Date;
  
    @IsOptional()
    @IsDateString()
    last_updated?: Date;
  }
  