import { Injectable } from '@nestjs/common';

@Injectable()
export class GroupChatsService {
  private messages = [];

  getMessages(courseId: string) {
    return { messages: this.messages.filter(msg => msg.courseId === courseId) };
  }

  sendMessage(messageData: any) {
    const { courseId, sender, role, content } = messageData;
    const message = {
      courseId,
      sender,
      role,
      content,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(message);
    return { message: 'Message sent successfully', data: message };
  }
}
