
const express = require('express')
const Reminder = require('./models/reminder')
const app = express()
app.use(express.static('build'))
const bodyParser = require('body-parser')
const cors = require('cors')
app.use(bodyParser.json())
app.use(cors())


const formatReminder = (reminder) => {
  const formattedNote = { name: reminder.name, timestamp: reminder.timestamp, id: reminder._id }
  delete formattedNote.__v
  delete formattedNote._id
  return formattedNote
}



let reminders = [
      {
        name: "Buy some eggs",
        timestamp: "2021-11-10T13:00:00.141Z",
        id: 1

      },
      {
        name: "Make an omelette",
        timestamp: "2021-11-11T08:00:00.141Z",
        id: 2

      },
      {
        name: "Wash dishes",
        timestamp: "2021-11-11T09:00:00.000Z",
        id: 3

      },
      {
        name: "Buy more eggs",
        timestamp: "2021-11-11T13:00:00.000Z",
        id: 4

      }
    ]
  
    
  app.get('/api/reminders', (req, res) => {
        Reminder
          .find({})
          .then(reminders => {
            res.json(reminders.map(formatReminder))
          })
    })
    
    app.get('/api/reminders/:id', (request, response) => {
          Reminder
            .findById(request.params.id)
            .then(reminder => {
              if (reminder){ response.json(formatReminder(reminder))
              }else {
                response.status(404).end()
              }     
            })
            .catch(error => { console.log(error)
              response.status(404).send({error: "malformatted id"})
            })
    })

    app.delete('/api/reminders/:id', (request, response) => {
      Reminder
        .findByIdAndRemove(request.params.id)
        .then(result => {
          response.status(204).end()
        })
        .catch(error => { response.status(400).send({ error: 'malformatted id' })
        })
    })
    
    app.post('/api/reminders', (request, response) => {
      const body = request.body
    
      if (body.name === undefined) { return response.status(400).json({error: 'content missing'})
      }else if (body.timestamp === undefined) {
          return response.status(400).json({error: 'content missing'})
      }

      reminders.forEach(reminder => {
        if(reminder.name === body.name){
             return response.status(400).json({ error: 'name must be unique' })
        }
      })
    
      const reminder = new Reminder({
        name: body.name,
        timestamp: body.timestamp
      })
      
      reminder
         .save()
         .then(formatReminder)
         .then(savedAndFormattedReminder => {
           response.json(savedAndFormattedReminder)
         })
    })
    
    const PORT = process.env.PORT || 3001
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })