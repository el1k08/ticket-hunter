const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const companySchema = new mongoose.Schema({
  image: { type: String },
  name: { type: String, require: true, minlength: 2, maxlength: 255 },
  description: { type: String, require: true, minlength: 100, maxlength: 2048 },
  address: {
    country: { type: String, require: true },
    city: { type: String, require: true },
    street: { type: String, require: true },
    house: { type: String, require: true },
    zip: { type: String, require: true }
  },
  airport: []
})

const Company = mongoose.model('Company', companySchema)

function validateCompany(company) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(100).max(2048).required(),
    address: Joi.object({
      country: Joi.string().required(),
      city: Joi.string().required(),
      street: Joi.string().required(),
      house: Joi.string().required(),
      zip: Joi.string().required(),
    }),
    airport: Joi.array().required()
  })

  return schema.validate(company)
}

module.exports = {
  Company,
  validateCompany
}