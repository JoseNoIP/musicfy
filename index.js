'use strict'

var mongoose = require('mongoose')
var app = require('./app')
var port = process.env.PORT || 3977

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/musicfy', (err, res) => {
	if (err) {
		throw err
	}else{
		console.log('The BD is running now...')



		app.listen(port, function(){
			console.log('Server is listening in http://localhost:' + port)
		})
	}
})

