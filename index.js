const http = require('http')
const {PORT} = process.env

const headerParser = (req, res) => {
	let ua = req.headers["user-agent"]
	let result = {
		ipaddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress.split(":").pop(),
		language: req.headers["accept-language"].split(',')[0],
		software: ua.slice(ua.indexOf('(')+1,ua.indexOf(')'))
	}
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(result))
}

http
	.createServer(headerParser)
	.listen(PORT || 3000, () => console.log('started'))