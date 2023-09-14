import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { PaginationModule } from 'src/pagination/pagination.module'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'

@Module({
	controllers: [ProductController],
	providers: [ProductService, PaginationService, PrismaService],
	imports: [PaginationModule]
})
export class ProductModule {}
