import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decarator'
import { UserDto } from './user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private userService: UserService) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Get()
	async getAllProfile() {
		return this.userService.getAll()
	}

	@Get('profile')
	@Auth()
	async getById(@CurrentUser('id') id: number) {
		return this.userService.byId(id)
	}

	@Get('by-slug/:slug')
	async getUserProfile(@Param('slug') slug: string) {
		return this.userService.bySlug(slug)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Auth()
	@Put('profile')
	async updateProfile(@CurrentUser('id') id: number, @Body() dto: UserDto) {
		return this.userService.updateProfile(id, dto)
	}

	@Auth()
	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Patch('profile/favorites/:productId')
	async toggleFavorite(
		@Param('productId') productId: string,
		@CurrentUser('id') id: number
	) {
		return this.userService.toggleFavorite(id, +productId)
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async deletePlayer(@CurrentUser('id') id: string) {
		return this.userService.delete(+id)
	}
}
