import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { AuthModule } from './auth/auth.module'
import { CategoryModule } from './category/category.module'
import { GenderModule } from './gender/gender.module'
import { MediaModule } from './media/media.module'
import { OrderModule } from './order/order.module'
import { PaginationModule } from './pagination/pagination.module'
import { ProductModule } from './product/product.module'
import { ReviewModule } from './review/review.module'
import { StatisticsModule } from './statistics/statistics.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		}),
		MulterModule.register(),
		ConfigModule.forRoot(),
		ProductModule,
		PaginationModule,
		UserModule,
		AuthModule,
		CategoryModule,
		OrderModule,
		ReviewModule,
		MediaModule,
		GenderModule,
		StatisticsModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
