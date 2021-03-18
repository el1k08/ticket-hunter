const mongoose = require('mongoose')
const config = require('config')

const db = config.get('db')
let link = ``;

function generateLink() {
  if(db.url === 'localhost') return link = `mongodb://localhost:27017/${db.name}`
  else return link = `mongodb+srv://${db.user}:${db.password}@cluster0.gtnar.azure.mongodb.net/${db.name}?retryWrites=true&w=majority`
}

const connectDB = () => {
  return mongoose.connect(generateLink(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false, 
  })
}

module.exports = connectDB