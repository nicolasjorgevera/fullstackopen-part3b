const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app =  express()

app.use(express.static('build'))

app.use(express.json())
const cors = require ('cors')

app.use (cors())

morgan.token('body', function (req, res) { 
    return (
        !req.body.name ? null : `{"name":"${req.body.name}","number":"${req.body.number}"}`
    )})

app.use(morgan(':method :url :status :res[content-length] -  :response-time ms :body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6412122"
    }
]

app.get ('/api/persons', (request, response) => {
    response.json (persons)
})

app.get ('/info', (request, response) => {
    response.send(`
    <div>
        <p>Phonebook has info for ${persons.length} people</p>
        <br></br>
        <p>${new Date()}</p>
    </div>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number (request.params.id)
    const person = persons.find (person => person.id === id)
    if (person){
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number (request.params.id)
    persons = persons.filter (person => person.id !== id)
    response.status(204).end()
})


app.post ('/api/persons/', (request, response) => {
    const body = request.body
    if (!body.name || body.name === "") {
        return response.status(400).json({
            error: 'Name missing'
        })
    }
    if (!body.number || body.number ==="") {
        return response.status(400).json({
            error: 'Number missing'
        })
    }
    if (!(persons.findIndex(person => person.name === body.name) === -1)){
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }
    const person = {
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})