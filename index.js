const express = require('express')
const url = require('url')
const urlValidate = require('./modules/urlvalidate')
const db = require('./modules/db')
const {encode, decode} = require('./modules/coder')
const app = express()

const {PORT} = process.env
const errorUrl = {"error":"Wrong url format, make sure you have a valid protocol and real site."}
const errorHash = {"error":"This url is not on the database."}
const errorDB = {"error":"DB Error."}

const buildUrl = (req, code) => url.format({
	protocol: req.protocol,
	host: req.get('host'),
	pathname: code
})

app.get('/', (req, res) => {
    res.send(
		`
		URL Shortener Microservice<br><br>
		Create new short url:<br>
		https://fccurlshortenermicroservice.herokuapp.com/new/https://www.google.com <br>
		answer: {"short_url":"https://fccurlshortenermicroservice.herokuapp.com/iB"}<br><br>
		Usage:
		https://fccurlshortenermicroservice.herokuapp.com/iB
		`
		)
})

app.get('/new/:url(*)', (req, res) => {
	let url = req.params.url
	if(urlValidate(url))
		db({url: url}, (err, id) => res.json(id ? {short_url: buildUrl(req, encode(id))} : errorDB))
	else res.json(errorUrl)
})

app.get('/:hash', (req, res) => {
	db({hash: decode(req.params.hash)}, (err, url) => url ? res.redirect(url.url) : res.json(errorHash))
})

app.listen(PORT || 3000, () => console.log('app started'))