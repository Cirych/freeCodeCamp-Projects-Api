const url = require('url')
const express = require('express')
const app = express()
const fetch = require('node-fetch')
const {PORT, GG_API_KEY, GG_CS_ID} = process.env
const queryList = new Set()

//init list with fakes
queryList.add('freeCodeCamp');queryList.add('cat');queryList.add('big cat');

const queryUrl = ({q, num = 10, start = 1}) => url.format({
	protocol: 'https',
	host: 'www.googleapis.com',
	pathname: 'customsearch/v1',
	query: {q, num, start, cx: GG_CS_ID, key: GG_API_KEY}
})

const sendResponse = ({json, response}) => {
	response.json(json.items.map(i => ({
		title: i.title,
		link: i.link,
		src: i.pagemap && i.pagemap.cse_image[0] && i.pagemap.cse_image[0].src
	})))
}

const addToQueryList = query => {
	if(queryList.size > 20 && !queryList.has(query)) {
		queryList.delete([...queryList][0])
		queryList.add(query)
	} else {
		queryList.add(query)
	}
}

app.get('/api/search', (request, response) => {
	let {num = 10, offset = 1, q} = request.query
	addToQueryList(q)

	fetch(queryUrl({q, num, start: num*offset-num+1}))
		.then(res => res.json())
		.then(json => sendResponse({json, response}))
		.catch(err => response.json({err}))
})

app.get('/api/recent', (request, response) => {
	response.json([...queryList])
})

app.get('*', (req, res) => {
    res.send(
		`
		Image Search Abstraction Layer<br><br>
		Get the image URLs, alt text and page urls for a set of images relating to a given search string:<br>
		https://fccimagesearchlayer.herokuapp.com/api/search?q=funny cats&offset=2<br><br>
		Recently submitted search strings: <br>
		https://fccimagesearchlayer.herokuapp.com/api/recent
		`
		)
})

app.listen(PORT || 3000, () => console.log('app started'))