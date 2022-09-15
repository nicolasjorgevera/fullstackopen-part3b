// const { request, response } = require('express')
require('dotenv').config()
const Person = require ('./models/person')
const express = require('express')
const app =  express()
const morgan = require('morgan')


app.use(express.static('build'))

app.use(express.json())
const cors = require ('cors')

app.use (cors())

morgan.token('body', function (req) {
  return (
    !req.body.name ? null : `{"name":"${req.body.name}","number":"${req.body.number}"}`
  )})

app.use(morgan(':method :url :status :res[content-length] -  :response-time ms :body'))

app.get ('/api/persons', (request, response) => {
  Person.find({}).then (person => {
    response.json(person)
  })
})

app.get ('/info', (request, response) => {
  Person.estimatedDocumentCount(function (error, count) {
    if (error){
      console.log(error)
    }else{
      response.send(`
            <div>
                <p>Phonebook has info for ${count} people</p>
                <br></br>
                <p>${new Date()}</p>
            </div>`
      )
    }
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post ('/api/persons/', (request, response, next) => {
  const body = request.body
  if (!body.name || body.name === '') {
    return response.status(400).json({
      error: 'Name missing'
    })
  }
  if (!body.number || body.number ==='') {
    return response.status(400).json({
      error: 'Number missing'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then( () => response.json(person))
    .catch(error => next(error))
})

app.put ('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate (request.params.id, person, { new: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send ({ erro: 'unknow endpoint' })
}

app.use (unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log('error.name: ---- ',error.name)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError'){
    if (error.errors.name){
      if (error.errors.name.kind === 'unique') {
        return response.status(400).send({ error: 'duplicated name' })
      } else if (error.errors.name.kind === 'minlength') {
        return response.status(400).send ({ error: 'minimum length for the name is 3 characters' })
      }
    } else if (error.errors.number) {
      if (error.errors.number.kind === 'minlength') {
        return response.status(400).send ({ error: 'minimum length for the number is 8 characters' })
      }
    }
    next(error)
  }
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})