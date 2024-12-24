import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  private notifications = [];

  getNotifications(studentId: string) {
    return this.notifications.filter(
      notification => notification.studentId === studentId
    );
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(
      notif => notif.id === notificationId
    );
    if (notification) {
      notification.isRead = true;
      return { message: 'Notification marked as read' };
    } else {
      return { error: 'Notification not found' };
    }
  }
}
