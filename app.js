'use strict'

var express = require('express')
var bodyParser = require('body-parser')

var app = express();

//Load routes



app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


//Configure http headers


//base routes

app.get('/test', (req, res) => {
	res.status(200).send({message:'Welcome to musicfy app'})
})


module.exports = app