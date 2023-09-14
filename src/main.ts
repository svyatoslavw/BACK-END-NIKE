import { NestFactory } from '@nestjs/core'
import * as cors from 'cors'
import { AppModule } from './app.module'
import { PrismaService } from './prisma.service'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const prismaService = app.get(PrismaService)
	await prismaService.enableShutdownHooks(app)

	app.use(
		cors({
			methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
			allowedHeaders: 'Content-Type, Authorization',
			credentials: true
		})
	)

	app.enableCors()

	app.setGlobalPrefix('/api')
	await app.listen(3002)
}
bootstrap()
