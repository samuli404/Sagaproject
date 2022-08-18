const mongoose = require('mongoose')
require('dotenv').config()

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.DATABASE_URL

mongoose.connect(url)

const reminderSchema = new mongoose.Schema({
    name: String,
    timestamp: String,
  })
  
const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder