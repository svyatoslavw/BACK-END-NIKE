import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { returnReviewObject } from './return-review.object'
import { ReviewDto } from './review.dto'

@Injectable()
export class ReviewService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.review.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			select: returnReviewObject
		})
	}

	async create(userId: number, dto: ReviewDto, productId: number) {
		return this.prisma.review.create({
			data: {
				...dto,
				product: {
					connect: {
						id: productId
					}
				},
				user: {
					connect: {
						id: userId
					}
				}
			}
		})
	}

	async update(id: number, dto: ReviewDto) {
		return this.prisma.review.update({
			where: {
				id
			},
			data: {
				text: dto.text,
				rating: dto.rating
			}
		})
	}

	async delete(id: number) {
		return this.prisma.review.delete({
			where: {
				id
			}
		})
	}

	async getAvgValueProductId(productId: number) {
		return this.prisma.review
			.aggregate({
				where: { productId },
				_avg: {
					rating: true
				}
			})
			.then(data => data._avg)
	}
}
