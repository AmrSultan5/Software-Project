import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty, IsOptional } 
from 'class-validator';

export class ModuleDto {
  @IsString()
  @IsNotEmpty()
  module_id: string;

  @IsString()
  @IsNotEmpty()
  course_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;  

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  resources: string[];

  @IsString()
  @IsNotEmpty()
  user_id: string;  
}
