import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  type: 'reply' | 'update';

  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class MarkNotificationAsReadDto {
  @IsString()
  @IsNotEmpty()
  notificationId: string;

  @IsBoolean()
  @IsOptional()
  isRead: boolean;
}
