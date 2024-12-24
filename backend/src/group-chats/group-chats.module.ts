import { Module } from '@nestjs/common';
import { GroupChatsController } from './group-chats.controller';
import { GroupChatsService } from './group-chats.service';

@Module({
  controllers: [GroupChatsController],
  providers: [GroupChatsService],
})
export class GroupChatsModule {}
