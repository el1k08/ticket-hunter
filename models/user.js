const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
  image: { type: String },
  firstName: { type: String, require: true, minlength: 2, maxlength: 255 },
  lastName: { type: String, require: true, minlength: 2, maxlength: 255 },
  email: { type: String, required: true, minlength: 6, maxlength: 255, unique: true },
  password: { type: String, required: true, minlength: 6, maxlength: 1024 },
  role: { type: String, default: 'USER' },
  createAt: { type: Date, default: Date.now },
  favorites: [{type: mongoose.Schema.Types.ObjectId, ref:'Flight'}],
  company: {type: mongoose.Schema.Types.ObjectId, ref:'Company'}
})

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, role: this.role }, config.get('jwtKey'))
  return token
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(2).max(255).required(),
    lastName: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(1024).required(),
    role: Joi.string(),
  })

  return schema.validate(user)
}

module.exports = {
  User,
  validateUser
}