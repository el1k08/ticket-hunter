const express = require('express')
const router = express.Router()

const authMW = require('../middleware/auth')
const { validateFlight, Flight } = require('../models/flight')



router.get('/', async (req, res, next) => { 

  if(req.query) {
    // Get flights by dates
    if(req.query.date) {
      if(!/^[0-9]*$/.test(req.query.date)) {
        return res.status(400).send('The date format is not correct.')
      }
      const flights = await Flight.find({ "direction.from.date": new Date(parseInt(req.query.date))})
      if(flights.length == 0) return res.status(404).send('Flights not found')
      return res.send(flights)
    }

    // Get flights by destination
    if(req.query.to || req.query.from) {
      if(req.query.to) {

        if(req.query.from) {
          const flights = await Flight.find({ "direction.to.airport": req.query.to, "direction.from.airport": req.query.from })
          if(flights.length == 0) {
            return res.status(404).send('Flights not found')
          }
          return res.send(flights)
        }

        const flights = await Flight.find({ "direction.to.airport": req.query.to })
        if(flights.length == 0) {
          return res.status(404).send('Flights not found')
        }
        return res.send(flights)

      } else if (req.query.from) {
        const flights = await Flight.find({ "direction.from.airport": req.query.from })
        if(flights.length == 0) {
          return res.status(404).send('Flights not found')
        }
        return res.send(flights)
      }

      return res.status(404).send('Flights not found')
    }
    
  }

  // Get all flights
  res.send(await Flight.find())
})



// Get flights by id
router.get('/:id', async (req, res, next) => { 
  const flight = await Flight.findOne({flightID: req.params.id})
  if(!flight) return res.status(404).send('The flight with the given ID was not found.')
  res.send(flight)
})

// Add new flight
router.post('/', authMW, async (req, res, next) => { 
  const { error } = validateFlight(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const f = await Flight.findOne({ flightID: req.body.flightID })
  if(f) return res.status(400).send('The flight ID is already registered')

  let flight = new Flight(req.body)

  res.send(await flight.save())
})

// Edit flight

router.put('/:id', authMW, async (req, res, next) => { 
  const { error } = validateFlight(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  if(req.body.flightID) delete req.body.flightID
  
  let flight = await Flight.findByIdAndUpdate({ _id: req.params.id }, req.body)
  if(!flight) return res.status(404).send('The flight with the given ID was not found.')
  
  flight = await Flight.findOne({ _id: req.params.id })
  res.send(flight)
})

// Remove flight
router.delete('/:id', authMW, async (req, res, next) => { 
  const flight = await Flight.findById({ _id: req.params.id })

  if(!flight) return res.status(404).send('The flight with the given ID was not found.')

  await flight.remove()
  res.send('Delete successfully.')
})

module.exports = router