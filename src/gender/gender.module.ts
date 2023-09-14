import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { GenderController } from './gender.controller'
import { GenderService } from './gender.service'

@Module({
	controllers: [GenderController],
	providers: [GenderService, PrismaService]
})
export class GenderModule {}
