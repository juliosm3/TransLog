import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { AuthModule } from '../auth/auth.module';
import { TrackingController } from './tracking.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ShipmentsService],
  controllers: [ShipmentsController, TrackingController],
})
export class ShipmentsModule {}