import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminService } from './backup.service';
import { BackupController } from './backup.controller';
import { BackupScheduler } from './backup.scheduler';
import { BackupSchema } from 'src/models/backup-record.schema';
import { UserSchema } from 'src/models/users.Schema';
import { CourseSchema } from 'src/models/courses.Schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Backup', schema: BackupSchema },
      { name: 'User', schema: UserSchema }, // Register UserModel
      { name: 'Course', schema: CourseSchema }, // Register CourseModel
    ]),
  ],
  controllers: [BackupController],
  providers: [AdminService, BackupScheduler],
})
export class AdminModule {}