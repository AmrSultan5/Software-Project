import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ResponsesModule } from './responses/responses.module';
import { ModuleModule } from './modules/modules.module';
import { UsersModule } from './users/users.module';
import { ProgressModule } from './progress/progress.module'
import { QuizzesModule } from './quizzes/quizzes.module';
import { NotesModule } from './notes/notes.module';
import { AuditLogSchema } from './models/audit-log.schema';
import { FailedLoginAttemptSchema} from './models/failed-login.schema';
import { AdminModule } from './services/admin.module';
import { Enrollment, EnrollmentSchema } from './models/enrollment-schema';
import { NotificationsModule } from './notifications/notifications.module';
import { GroupChatsModule } from './group-chats/group-chats.module';

@Module({
  imports: [  
    NotificationsModule,
    GroupChatsModule,
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.Mongo),
    CoursesModule,
    AuthModule,
    ResponsesModule,
    ModuleModule,
    UsersModule,
    ProgressModule,
    QuizzesModule,
    NotesModule,
    AdminModule,
    MongooseModule.forFeature([
      { name: 'AuditLog', schema: AuditLogSchema },
      { name: 'FailedLogin', schema: FailedLoginAttemptSchema },
      { name: Enrollment.name, schema: EnrollmentSchema }
    ]),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
