import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import { ensureDir, writeFile } from 'fs-extra'

@Injectable()
export class MediaService {
	async saveMediaFiles(mediaFiles: Express.Multer.File[]): Promise<string[]> {
		const folder = 'products'
		const uploadFolder = `${path}/uploads/${folder}`
		await ensureDir(uploadFolder)

		const savedMediaFiles: string[] = []

		for (const mediaFile of mediaFiles) {
			const fileName = mediaFile.originalname
			await writeFile(`${uploadFolder}/${fileName}`, mediaFile.buffer)

			savedMediaFiles.push(`/uploads/${folder}/${fileName}`)
		}

		return savedMediaFiles
	}
}
