import { Module } from '@nestjs/common';
import { AdminSimpleController } from './admin-simple.controller';
import { AdminDashboardSimpleService } from './admin-dashboard-simple.service';
import { AdminUsersSimpleService } from './admin-users-simple.service';
import { AdminPacksSimpleService } from './admin-packs-simple.service';
import { AdminMockService } from './admin-mock.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminSimpleController],
  providers: [
    AdminDashboardSimpleService,
    AdminUsersSimpleService,
    AdminPacksSimpleService,
    AdminMockService,
  ],
  exports: [
    AdminDashboardSimpleService,
    AdminUsersSimpleService,
    AdminPacksSimpleService,
    AdminMockService,
  ],
})
export class AdminModule {}
