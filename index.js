const express = require('express')
const multer = require('multer')

const app = express()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const {PORT} = process.env

app.use(express.static('public'))

app.post('/', upload.single('file'), (request, response) => {
	if(request.file) response.json({size: request.file.size})
	else response.json({error: 'error'})
})

app.listen(PORT || 3000, () => console.log('app started'))