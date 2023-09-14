import { Injectable, NotFoundException } from '@nestjs/common'
import { EnumOrderStatus } from '@prisma/client'
import { ClientFactory } from 'monobank-api-client'
import { PrismaService } from 'src/prisma.service'
import { returnProductObject } from 'src/product/return-product.object'
import { OrderDto } from './order.dto'

const MonoAPI = require('monobank-api-acquiring')
const api = ClientFactory.createPersonal(
	'uvwTiH5oWiXh6GWHth22Q8Q-CIHeBTDSFfylALadh5XQ'
)

@Injectable()
export class OrderService {
	constructor(private prisma: PrismaService) {}

	async getAll() {
		return this.prisma.order.findMany({
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: {
					include: {
						product: {
							select: returnProductObject
						}
					}
				}
			}
		})
	}

	async getById(id: number) {
		return this.prisma.order.findUnique({
			where: {
				id
			},
			include: {
				items: {
					include: {
						product: {
							select: returnProductObject
						}
					}
				}
			}
		})
	}

	async getByUserId(userId: number) {
		return this.prisma.order.findMany({
			where: {
				userId
			},
			orderBy: {
				createdAt: 'desc'
			},
			include: {
				items: {
					include: {
						product: {
							select: returnProductObject
						}
					}
				}
			}
		})
	}

	async placeOrder(dto: OrderDto, userId: number) {
		const total = dto.items.reduce((acc, item) => {
			return acc + item.price * item.quantity
		}, 0)

		const api = new MonoAPI('uvwTiH5oWiXh6GWHth22Q8Q-CIHeBTDSFfylALadh5XQ', {
			storageType: null
		})

		const paymentData = {
			amount: total,
			ccy: 840,
			redirectUrl: 'http://localhost:3000/thanks',
			webHookUrl: 'https://15c6-91-226-34-192.ngrok.io/api/orders/status',
			validity: 3600,
			paymentType: 'debit'
		}

		const monobankPayment = await api.createInvoice(paymentData)

		const order = await this.prisma.order.create({
			data: {
				status: dto.status,
				items: {
					create: dto.items
				},
				total,
				user: {
					connect: {
						id: userId
					}
				},
				invoiceId: monobankPayment.invoiceId
			}
		})
		return monobankPayment
	}

	async updateStatusByInvoiceId(invoiceId: string) {
		// Поиск заказа по идентификатору инвойса
		const order = await this.prisma.order.findFirst({
			where: {
				invoiceId: invoiceId
			}
		})

		if (!order) {
			throw new NotFoundException(
				`Order with invoice ID ${invoiceId} not found`
			)
		}

		// Обновление статуса заказа
		const updatedOrder = await this.prisma.order.update({
			where: {
				id: order.id
			},
			data: {
				status: EnumOrderStatus.PAYED
			}
		})

		return updatedOrder
	}
	// async updateStatus(orderId: number, newStatus: EnumOrderStatus) {
	// 	return this.prisma.order.update({
	// 		where: {
	// 			id: orderId
	// 		},
	// 		data: {
	// 			status: newStatus
	// 		}
	// 	})
	// }

	async delete(orderId: number) {
		return this.prisma.order.delete({ where: { id: orderId } })
	}
}
