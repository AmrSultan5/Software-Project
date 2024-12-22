import { Injectable, OnModuleInit } from '@nestjs/common';
import * as cron from 'node-cron';
import { AdminService } from './backup.service';

@Injectable()
export class BackupScheduler implements OnModuleInit {
  constructor(private readonly backupService: AdminService) {}

  onModuleInit() {
    // Schedule backup daily at midnight
    cron.schedule('0 0 * * *', async () => {
      console.log('Running scheduled backup...');
      await this.backupService.createBackup();
    });
  }
}