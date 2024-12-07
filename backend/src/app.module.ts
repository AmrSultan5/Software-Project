import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ResponsesModule } from './responses/responses.module';
// import { ModuleModule } from './modules/modules.module';

@Module({
  imports: [  
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.Mongo),
    CoursesModule,
    AuthModule,
    ResponsesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
