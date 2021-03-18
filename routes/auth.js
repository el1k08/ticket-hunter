const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const Joi = require('@hapi/joi')
const { User } = require('../models/user')

router.post('/', async (req, res, next) => { 
  // validate user
  const { err } = validate(req.body)
  if(err) return res.status(400).send(err.details[0].message)

  // validate user existens
  let user = await User.findOne({email: req.body.email})
  if(!user) return res.status(400).send('Invalid user or password')

  // validate password
  const isValid = await bcrypt.compare(req.body.password, user.password)
  if(!isValid) return res.status(400).send('Invalid user or password')

  // send token
  res.send({token: user.generateAuthToken()})
})

function validate(obj) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(1024).required()
  })

  return schema.validate(obj)
}

module.exports = router