import { Controller, Get, Patch, Body, Param } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':studentId')
  async getNotifications(@Param('studentId') studentId: string) {
    return this.notificationsService.getNotifications(studentId);
  }

  @Patch()
  async markNotificationAsRead(@Body() notificationData: any) {
    return this.notificationsService.markAsRead(notificationData.notificationId);
  }
}
