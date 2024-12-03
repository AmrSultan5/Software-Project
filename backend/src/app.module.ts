import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [  
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.Mongo),
    CoursesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
