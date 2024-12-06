import { IsNotEmpty, IsString, IsOptional, IsDateString, ArrayMinSize } from 'class-validator';

export class QuizDto {
    @IsNotEmpty()
    @IsString()
    quiz_id: string;

    @IsNotEmpty()
    @IsString()
    module_id: string;

    @IsNotEmpty()
    @ArrayMinSize(1)
    questions: {
        question_text: string;
        options: string[];
        correct_answer: string;
    }[];

    @IsNotEmpty()
    @IsDateString()
    created_at: Date;
}