import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decarator'
import { OrderDto } from './order.dto'
import { OrderService } from './order.service'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Get()
	@Auth('admin')
	getAll() {
		return this.orderService.getAll()
	}

	@Get('by-user')
	@Auth()
	getByUserId(@CurrentUser('id') userId: number) {
		return this.orderService.getByUserId(userId)
	}
	@Get(':id')
	@Auth()
	getById(@Param('id') id: number) {
		return this.orderService.getById(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	placeOrder(@Body() dto: OrderDto, @CurrentUser('id') userId: number) {
		return this.orderService.placeOrder(dto, userId)
	}

	// @HttpCode(200)
	// @Post('status')
	// async handleWebhookNotification(@Body() dto: any) {
	// 	try {
	// 		const { invoiceId, status, modifiedDate } = dto

	// 		// Здесь вы можете добавить логику для проверки modifiedDate
	// 		// и обновления статуса заказа на основе полученных данных.

	// 		if (status === 'success') {
	// 			await this.orderService.updateStatus(invoiceId, EnumOrderStatus.PAYED)
	// 		} else if (status === 'processing') {
	// 			await this.orderService.updateStatus(invoiceId, EnumOrderStatus.PENDING)
	// 		}

	// 		return { message: 'Уведомление обработано' }
	// 	} catch (error) {
	// 		console.error(error)
	// 		throw new InternalServerErrorException('Ошибка обработки уведомления')
	// 	}
	// }

	// @HttpCode(200)
	// @Post('status')
	// async updateStatus(@Body() dto: PaymentStatusDto) {
	// 	return this.orderService.updateStatus(dto)
	// }

	@Post('status')
	async updateStatus(@Body() body: any) {
		const { invoiceId, status, modifiedDate } = body

		if (status === 'success') {
			return this.orderService.updateStatusByInvoiceId(invoiceId)
		} else if (status === 'processing') {
			return this.orderService.updateStatusByInvoiceId(invoiceId)
		}

		return 'OK'
	}

	@HttpCode(200)
	@Delete(':id')
	@Auth('admin')
	async delete(@Param('id') id: string) {
		return this.orderService.delete(+id)
	}
}
