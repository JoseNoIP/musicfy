'use strict'

var bcrypt = require('bcrypt-nodejs')
var User = require('../models/user')


function test(req, res) {
	res.status(200).send({
		message: 'Testing a controller action...'
	})
}

function saveUser(req, res) {
	var user = new User()
	var params = req.body

	console.log(params)

	user.name = params.name
	user.lastname = params.lastname
	user.email = params.email
	user.role = 'ROLE_ADMIN'
	user.image = 'null'

	if (params.password) {
		//Encrypt password

		bcrypt.hash(params.password, null, null, (err, hash) => {

			user.password = hash;
			if (user.name && user.lastname && user.email) {
				//Save user
				user.save((err, userStored) => {
					if (err) {
						res.status(500).send({
							message: 'An error has occurred while saving the user...'
						})
					} else if(!userStored){
						res.status(404).send({
							message: 'User not saved...'
						})
					}else{
						res.status(200).send({
							message: 'The user was saved correctly...',
							user: userStored
						})
					}
				})

			} else {
				res.status(200).send({
					message: 'All fields are required...'
				})
			}
		})
		
	}else{
		res.status(200).send({
			message: 'Password is required...'
		})
	}
}

function loginUser(req, res) {
	
	var params = req.body

	var email = params.email
	var password = params.password

	User.findOne({email: email.toLowerCase()}, (err, user) => {

		if (err) {
			res.status(500).send({message: 'An err was occurred...'})
		} else if(!user){
			res.status(404).send({message: 'User dont exist...'})
		}else{
			bcrypt.compare(password, user.password, (err, check) => {
				if (check) {
					//Response user data
					if (params.gethash) {
						// Response jwt token
					}else{
						res.status(200).send({user})
					}


				} else {
					console.log(err)
					res.status(404).send({message: 'User or password incorrectly'})
				}
			})
		}

	})

}


module.exports = {
	test,
	saveUser,
	loginUser
}