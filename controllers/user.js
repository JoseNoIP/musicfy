'use strict'

var bcrypt = require('bcrypt-nodejs')
var User = require('../models/user')
var jwt = require('../services/jwt')


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
						res.status(200).send({token: jwt.createToken(user)})
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

function updateUser(req, res) {
	var userId = req.params.id
	var update = req.body

	User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
		if (err) {
			res.status(500).send({message: 'An err was occurred...'})
		}else if(!userUpdated){
			res.status(404).send({message: 'Cant update user...'})
		}else{
			res.status(200).send({user: userUpdated})
		}
	})

}


function uploadImage(req, res){
	var userId = req.params.id
	var file_name = 'Don\'t upload...'

	if (req.files) {

		var file_path = req.files.image.path
		var path_split = file_path.split('\/');
		file_name = path_split[path_split.length - 1]
		var ext_split = file_name.split('\.')
		var ext = ext_split[ext_split.length - 1].toLowerCase();

		if (ext == 'jpg' || ext == 'jpeg' || ext == 'png' || ext == 'gif') {

			User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
				if (!userUpdated) {
					res.status(404).send({message: 'User not updated...'})
				} else {
					res.status(200).send({user: userUpdated})
				}
			})

		}else{
			res.status(200).send({message: 'Image attached not valid extension...'})
		}

	}else{
		res.status(200).send({message: 'Image not attached...'})
	}
}


module.exports = {
	test,
	saveUser,
	loginUser,
	updateUser,
	uploadImage
}