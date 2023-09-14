import { Prisma } from '@prisma/client'

export const returnUserObject: Prisma.UserSelect = {
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
