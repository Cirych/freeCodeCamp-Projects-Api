const express = require('express')
const app = express()
const moment = require('moment');
const {PORT} = process.env

app.get('/', function(req, res) {
    res.send('Hello World!')
})

app.get('/:date', function (req, res) {
	const result = { "unix": null, "natural": null }
	let date = unescape(req.params.date)
	let unixDate = Number(date)
	if(unixDate) date = moment.unix(unixDate)
	else date = moment.utc(date)
	if(date.isValid()) {
		result.unix = date.format('X')
		result.natural = date.format('MMMM DD, YYYY')
	}
	res.send(result)
})

app.listen(PORT || 3000, function() {
    console.log('app started')
})