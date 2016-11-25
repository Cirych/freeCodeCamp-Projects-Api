const express = require('express')
const app = express()
const {PORT} = process.env

app.get('/', function(req, res) {
    res.send('Hello World!')
})

app.listen(PORT || 3000, function() {
    console.log('app started')
})