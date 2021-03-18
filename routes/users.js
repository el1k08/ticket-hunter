const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { User, validateUser } = require('../models/user')

const authMW = require('../middleware/auth')

router.get('/me', authMW, async (req, res, next) => { 
  const user = await User.findById(req.user._id).select('-password -__v')
  res.send(user)
})

// New user
router.post('/', async (req, res, next) => { 
  // validate user body
  const { err } = validateUser(req.body)
  if(err) return res.status(400).send(err.details[0].message)

  // validate email doesn't exist
  let user = await User.findOne({ email: req.body.email })
  if(user) return res.status(400).send('User alreasdy registered')

  // create a new user 
  user = await new User(req.body)
  const salt = await bcrypt.genSalt(12)
  user.password = await bcrypt.hash(user.password, salt)
  await user.save()
  return res.send(_.pick(user, ["id", "image", "firstName", "lastName", "email", "company"]))
})

// Edit user
router.put('/me', authMW, async (req, res, next) => { 
  // validate user body
  const { err } = validateUser(req.body)
  if(err) return res.status(400).send(err.details[0].message)

  // find and update user
  if(req.user.body) {
    const salt = await bcrypt.getSalt(12)
    req.body.password = await bcrypt.hash(req.body.password, salt)
  }

  let user = await User.findByIdAndUpdate(req.user._id, req.body)
  if(!user) return res.status(404).send('The user with the given ID was not found.')

  // response user
  user = await User.findById(req.user._id).select('-password -createAt -__v')
  res.send(user)
})

// Delete user
router.delete('/me', authMW, async (req, res, next) => { 
  try {
    const user = await User.findById(req.user._id)
    await user.remove()
    return res.send('User profile was successfully deleted')
  } catch(err) {
    res.status(400)
  }
})

module.exports = router