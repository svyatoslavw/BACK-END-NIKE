import { Prisma } from '@prisma/client'

export const returnGenderObject: Prisma.GenderSelect = {
	id: true,
	name: true,
	slug: true
}
