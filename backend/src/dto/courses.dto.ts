import {
    IsNotEmpty,
    IsString,
    IsEnum,
    IsOptional,
    IsDateString,
  } from 'class-validator';
  
  export class CourseDto {
    @IsNotEmpty()
    @IsString()
    course_id: string;
  
    @IsNotEmpty()
    @IsString()
    title: string;
  
    @IsOptional()
    @IsString()
    description: string;
  
    @IsNotEmpty()
    @IsString()
    category: string;
  
    @IsNotEmpty()
    @IsEnum(['Beginner', 'Intermediate', 'Advanced'], {
      message:
        'difficulty_level must be one of the following values: Beginner, Intermediate, Advanced',
    })
    difficulty_level: string;
  
    @IsNotEmpty()
    @IsString()
    created_by: string;
  
    @IsOptional()
    @IsDateString()
    created_at: Date;
  }  