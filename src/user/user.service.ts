import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hash } from 'argon2'
import { PrismaService } from 'src/prisma.service'
import { UserDto } from './user.dto'

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		const user = await this.prisma.user.findMany({
			select: {
				id: true,
				createdAt: true,
				email: true,
				password: false,
				name: true,
				slug: true,
				isAdmin: true,
				avatarPath: true,
				orders: false,
				privacy: true,
				reviews: true,
				favorites: {
					select: {
						id: true,
						createdAt: true,
						product: true,
						productId: true
					}
				}
			}
		})
		if (!user) throw new Error('Users not found')

		return user
	}

	async byId(id: number, selectObject: Prisma.UserSelect = {}) {
		const user = await this.prisma.user.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				createdAt: true,
				email: true,
				name: true,
				slug: true,
				privacy: true,
				avatarPath: true,
				password: false,
				orders: true,
				reviews: true,
				favorites: {
					select: {
						id: true,
						createdAt: true,
						product: true,
						productId: true
					}
				},
				...selectObject
			}
		})

		if (!user) throw new Error('User not found')

		return user
	}

	async bySlug(slug: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				slug
			},
			select: {
				id: true,
				createdAt: true,
				email: true,
				name: true,
				slug: true,
				privacy: true,
				avatarPath: true,
				password: false,
				orders: true,
				reviews: true,
				favorites: {
					select: {
						id: true,
						createdAt: true,
						product: true,
						productId: true
					}
				}
			}
		})

		if (!user) throw new Error('User not found')

		return user
	}

	async updateProfile(id: number, dto: UserDto) {
		const isSameUser = await this.prisma.user.findUnique({
			where: {
				email: dto.email
			}
		})

		if (isSameUser && id !== isSameUser.id)
			throw new BadRequestException('Этот Email уже используется')

		const user = await this.byId(id)

		return this.prisma.user.update({
			where: {
				id
			},
			data: {
				email: dto.email,
				name: dto.name,
				avatarPath: dto.avatarPath,
				password: dto.password ? await hash(dto.password) : user.password
			}
		})
	}

	async toggleFavorite(userId: number, productId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: {
				favorites: {
					select: {
						id: true,
						product: {
							select: {
								id: true,
								images: true,
								price: true,
								name: true
							}
						},
						productId: true,
						user: true,
						userId: true
					}
				}
			}
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		const isFavorite = user.favorites.some(
			favorite => favorite.productId === productId
		)

		if (isFavorite) {
			await this.prisma.favorite.deleteMany({
				where: {
					userId,
					productId
				}
			})
		} else {
			await this.prisma.favorite.create({
				data: {
					userId,
					productId
				}
			})
		}

		return 'Success'
	}

	async delete(userId: number) {
		return this.prisma.user.delete({ where: { id: userId } })
	}

	// async toggleFavorite(userId: number, newsId: number) {
	// 	const user = await this.byId(userId)

	// 	if (!user) throw new NotFoundException('Пользователь не найден')

	// 	const isExists = user.favorites.some(news => news.id === newsId)

	// 	await this.prisma.user.update({
	// 		where: {
	// 			id: user.id
	// 		},
	// 		data: {
	// 			favorites: {
	// 				[isExists ? 'disconnect' : 'connect']: {
	// 					id: newsId
	// 				}
	// 			}
	// 		}
	// 	})
	// 	return 'Success'
	// }
}
