import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { users,UserSchema } from 'src/models/users.Schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({  imports: [
  MongooseModule.forFeature([{ name: users.name, schema: UserSchema }]),
],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
