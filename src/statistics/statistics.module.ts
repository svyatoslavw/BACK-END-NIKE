import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';

@Module({
	controllers: [StatisticsController],
	providers: [StatisticsService, UserService, PrismaService]
})
export class StatisticsModule {}
