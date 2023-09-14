import { ArrayMinSize, IsNumber, IsOptional, IsString } from 'class-validator'

export class ProductDto {
	@IsString()
	name: string

	@IsString()
	description: string

	@IsNumber()
	price: number

	@IsString({ each: true })
	@ArrayMinSize(1)
	images: string[]

	@IsOptional()
	@IsNumber()
	categoryId: number

	@IsOptional()
	@IsNumber()
	genderId: number
}
