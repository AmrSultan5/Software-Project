import {  IsNotEmpty,IsString,IsOptional,IsArray,IsDateString,}
from 'class-validator';

export class UpdateModuleDto {
    @IsOptional()
    @IsString()
    title?: string; 

    @IsOptional()
    @IsString()
    content?: string; 

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    resources?: string[]; 

    @IsOptional()
    @IsDateString()
    created_at?: Date; 
}
