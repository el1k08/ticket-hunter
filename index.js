const express = require('express')
const app = express()
const config = require('config')

const PORT = process.env.PORT || config.get('server').port

const connectDB = require('./config/db')

app.use( express.json() )
app.use( express.static('public') )

const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const flightsRouter = require('./routes/flights')

app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/flights', flightsRouter)

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server start\nPort: ${PORT}`)))
  .catch(err => console.error('Error', JSON.stringify(err)))