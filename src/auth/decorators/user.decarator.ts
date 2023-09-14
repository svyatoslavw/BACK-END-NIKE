import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { User } from '@prisma/client'

export const CurrentUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user

		if (!user) {
			// Обработайте случай, когда пользователь не авторизован, либо когда его данные отсутствуют
			throw new Error('User not authenticated or user data is missing')
		}

		return data ? user[data] : user
	}
)
