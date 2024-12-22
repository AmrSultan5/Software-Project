import { Controller, Post, Get, Delete, Param } from '@nestjs/common';
import { AdminService } from 'src/services/backup.service';

@Controller('admin/backup')
export class BackupController {
  constructor(private readonly backupService: AdminService) {}

  @Post('/manual')
async createManualBackup() {
    const backup = await this.backupService.createBackup();
    return {
        message: 'Backup created successfully',
        backup,
    };
}

@Get('/history')
async getBackupHistory() {
    return await this.backupService.getBackupHistory();
}

@Delete('/:backup_id')
async deleteBackup(@Param('backup_id') backup_id: string) {
    await this.backupService.deleteBackup(backup_id);
    return { message: 'Backup deleted successfully' };
}
}