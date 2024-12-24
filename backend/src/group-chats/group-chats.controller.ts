import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GroupChatsService } from './group-chats.service';

@Controller('group-chats')
export class GroupChatsController {
  constructor(private readonly groupChatsService: GroupChatsService) {}

  @Get(':courseId')
  async getGroupChatMessages(@Param('courseId') courseId: string) {
    return this.groupChatsService.getMessages(courseId);
  }

  @Post()
  async sendMessage(@Body() messageData: any) {
    return this.groupChatsService.sendMessage(messageData);
  }
}
