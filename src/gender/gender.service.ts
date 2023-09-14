import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { generateSlug } from 'src/utils/generate-slug'
import { GenderDto } from './gender.dto'
import { returnGenderObject } from './return-gender.object'

@Injectable()
export class GenderService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.gender.findMany({
			select: returnGenderObject
		})
	}

	async byId(id: number) {
		const gender = await this.prisma.gender.findUnique({
			where: {
				id
			},
			select: returnGenderObject
		})

		if (!gender) throw new NotFoundException('Gender not found')

		return gender
	}

	async bySlug(slug: string) {
		const gender = await this.prisma.gender.findUnique({
			where: {
				slug
			},
			select: returnGenderObject
		})

		if (!gender) throw new NotFoundException('Gender not found')

		return gender
	}

	async create() {
		return this.prisma.gender.create({
			data: {
				name: '',
				slug: ''
			}
		})
	}

	async update(id: number, dto: GenderDto) {
		return this.prisma.gender.update({
			where: {
				id
			},
			data: {
				name: dto.name,
				slug: generateSlug(dto.name)
			}
		})
	}

	async delete(id: number) {
		return this.prisma.gender.delete({
			where: {
				id
			}
		})
	}
}
