const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const flightSchema = new mongoose.Schema({
  flightID: { type: String, required: true, minlength: 6, maxlength: 12, unique: true },  
  direction: {
    from: {
      airport: { type: String, require: true, minlength: 2, maxlength: 255 },
      date: { type: Date, require: true }
    },
    to: {
      airport: { type: String, require: true, minlength: 2, maxlength: 255 },
      date: { type: Date, require: true }
    }
  },
  price: { type: String, require: true },
  company: {type: mongoose.Schema.Types.ObjectId, ref:'Company', default: null},
  aircraft: { type: String, require: true }
})

const Flight = mongoose.model('Flight', flightSchema)

function validateFlight(flight) {
  const schema = Joi.object({
    flightID: Joi.string().min(6).max(12).required(),
    direction: Joi.object({
      from: Joi.object({
        airport: Joi.string().min(2).max(255).required(),
        date: Joi.date().required()
      }),
      to: Joi.object({
        airport: Joi.string().min(2).max(255).required(),
        date: Joi.date().required()
      })
    }),
    price: Joi.string().required(),
    aircraft: Joi.string().required()
  })

  return schema.validate(flight)
}

module.exports = {
  Flight,
  validateFlight
}