require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


//MongoDB
const PhoneNumber = require('./models/phonenumber')
/*
let phoneNumbers = [
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 1
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 2
    },
    {
        name: "Arto Hellas",
        number: "39-44-5323523",
        id: 3
    },
    {
        name: "Victor",
        number: "1234",
        id: 4
    }
]
*/
//get endpoints 
app.get('/', (req, res) => {
    res.send('<h1>Hell from Victor</h1>')
})

app.get('/api/persons', (req, res) => {
    PhoneNumber.find({}).then(x => {
        res.json(x)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = phoneNumbers.find(person => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(400).end()
    }
})

app.get('/info', (req, res) => {
    const info = phoneNumbers.length
    const currentDate = new Date().toLocaleDateString('eu-EU')

    res.send(`<p>Phone has info for ${info} people</p><p>${currentDate}</p>`)
})


//delete endpoint
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phoneNumbers = phoneNumbers.filter(p => p.id !== id)
    response.status(204).end
})


//post endpoint
app.post('/api/persons', (request, response) => {
    const body = request.body

    console.log(body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = new PhoneNumber({
        name: body.name,
        number: body.number || false,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

//morgan


const customLogger = (tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        ' - ',
        tokens['reponse-time', (req, res)],
        ' ms'
    ].join(' ')
}
app.use(morgan(customLogger))


//other function for functionality

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server running', PORT)
})