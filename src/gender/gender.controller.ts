import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { UserDto } from 'src/user/user.dto'
import { GenderService } from './gender.service'

@Controller('genders')
export class GenderController {
	constructor(private readonly genderService: GenderService) {}

	@Get()
	async getAll() {
		return this.genderService.getAll()
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.genderService.bySlug(slug)
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.genderService.byId(+id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: UserDto) {
		return this.genderService.update(+id, dto)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Post()
	async create() {
		return this.genderService.create()
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Delete()
	async delete(@Param('genderId') genderId: string) {
		return this.genderService.delete(+genderId)
	}
}
