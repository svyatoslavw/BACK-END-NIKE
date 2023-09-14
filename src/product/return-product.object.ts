import { Prisma } from '@prisma/client'
import { returnCategoryObject } from 'src/category/return-category.object'
import { returnGenderObject } from 'src/gender/return-gender.object'
import { returnReviewObject } from 'src/review/return-review.object'

export const returnProductObject: Prisma.ProductSelect = {
	images: true,
	name: true,
	price: true,
	id: true,
	createdAt: true,
	genderId: true,
	categoryId: true,
	description: true,
	slug: true
}

export const returnProductObjectFull: Prisma.ProductSelect = {
	...returnProductObject,
	reviews: {
		select: returnReviewObject,
		orderBy: {
			createdAt: 'desc'
		}
	},
	category: {
		select: returnCategoryObject
	},
	gender: {
		select: returnGenderObject
	}
}
