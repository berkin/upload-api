import morgan from 'morgan'
import express from 'express'
import multer from 'multer'
import fs from 'fs'
import v4 from 'uuid/v4'
import mime from 'mime'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'

const result = dotenv.config()

if (result.error) {
	throw result.error
}

const PORT = process.env.PORT || 3000

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
})

const storage = multer.memoryStorage()
const upload = multer({ storage })

const app = express()
app.use(morgan('dev'))

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept',
	)
	next()
})

app.get('/', (req, res) => {
	res.json({
		heartbeat: true,
	})
})

app.post('/upload', upload.single('file'), (req, res) => {
	var stream = cloudinary.v2.uploader
		.upload_stream((error, result) => {
			if (error) {
				res.statusCode = 400
				return res.json({
					error,
				})
			}
			res.json({
				result,
			})
		})
		.end(req.file.buffer)
})

app.get('/file/:id', (req, res) => {
	cloudinary.v2.api.resource(req.params.id, (error, result) => {
		if (error) {
			res.statusCode = 400
			return res.json({
				error,
			})
		}
		res.json({
			result,
		})
	})
})

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`)
})
