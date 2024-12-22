import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BackupDocument } from 'src/models/backup-record.schema';
import { CourseDocument } from 'src/models/courses.Schema';
import { UserDocument } from 'src/models/users.Schema';
import { v4 as uuidv4 } from 'uuid'; // Import UUID
import * as archiver from 'archiver';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('Backup') private readonly backupModel: Model<BackupDocument>,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    @InjectModel('Course') private readonly courseModel: Model<CourseDocument>,
  ) {}

  async createBackup(): Promise<{ backup_id: string; fileName: string }> {
    const backup_id = `backup_${Date.now()}`;
    const fileName = `${backup_id}.zip`;
    const backupDir = path.join(process.cwd(), 'backups'); // Use `process.cwd()`
  
    const backupFilePath = path.join(backupDir, fileName);
  
    // Ensure the backups directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
  
    // Fetch data
    const users = await this.userModel.find().exec();
    const courses = await this.courseModel.find().exec();
  
    // Create backup
    const output = fs.createWriteStream(backupFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });
  
    archive.pipe(output);
  
    // Add data to backup
    archive.append(JSON.stringify(users, null, 2), { name: 'users.json' });
    archive.append(JSON.stringify(courses, null, 2), { name: 'courses.json' });
  
    await archive.finalize();
  
    // Save backup record to the database
    const backupRecord = new this.backupModel({
      backup_id,
      fileName,
      createdAt: new Date(),
    });
    await backupRecord.save();
  
    return { backup_id, fileName };
  }  

async getBackupHistory(): Promise<BackupDocument[]> {
  const backups = await this.backupModel
    .find({}, { backup_id: 1, fileName: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .exec();
  
  console.log("Backup History Data:", backups); // Debug log
  return backups;
}

async deleteBackup(backup_id: string): Promise<void> {
  const backup = await this.backupModel.findOneAndDelete({ backup_id });
  if (!backup) {
      throw new NotFoundException(`Backup with ID ${backup_id} not found`);
  }
}
}