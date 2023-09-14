import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UserService } from 'src/user/user.service'

@Injectable()
export class StatisticsService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService
	) {}

	async getMainStatistics() {
		const usersCount = await this.prisma.user.count()
		const productsCount = await this.prisma.product.count()
		const reviewsCount = await this.prisma.review.count()
		const ordersCount = await this.prisma.order.count()
		const totalAmount = await this.prisma.order.aggregate({
			_sum: {
				total: true
			}
		})

		return [
			{
				name: 'Users',
				value: usersCount
			},
			{
				name: 'Products',
				value: productsCount
			},
			{
				name: 'Reviews',
				value: reviewsCount
			},
			{
				name: 'Orders',
				value: ordersCount
			},
			{
				name: 'Total amount',
				value: totalAmount._sum.total
			}
		]
	}
}
