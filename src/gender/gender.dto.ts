import { IsString } from 'class-validator'

export class GenderDto {
	@IsString()
	name: string
}
