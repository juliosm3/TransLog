import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ShipmentsModule } from './shipments/shipments.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ShipmentsModule],
})
export class AppModule {}
