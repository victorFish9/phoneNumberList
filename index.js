const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const morgan = require('morgan')



//MongoDB
const PhoneNumber = require('./models/phonenumber')
const { Phone } = require('@mui/icons-material')

//request logger for error handling
const requestLogger = (request, response, next) => {
    console.log('Method: ', request.method)
    console.log('Path: ', request.path)
    console.log('Body: ', request.body)
    console.log('---')
    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

const unknowEndpoint = (request, response) => {
    response.status(400).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('dist'))

//get endpoints 
app.get('/', (req, res) => {
    res.send('<h1>Hell from Victor</h1>')
})

app.get('/api/persons', (req, res) => {
    PhoneNumber.find({}).then(x => {
        res.json(x)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    PhoneNumber.findById(req.params.id)
        .then(x => {
            if (x) {
                res.json(x)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    const info = phoneNumbers.length
    const currentDate = new Date().toLocaleDateString('eu-EU')

    res.send(`<p>Phone has info for ${info} people</p><p>${currentDate}</p>`)
})


//delete endpoint
app.delete('/api/persons/:id', (request, response, next) => {
    PhoneNumber.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


//post and put endpoint
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

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    PhoneNumber.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatePerson => {
            response.json(updatePerson)
        })
        .catch(error => next(error))
})



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

app.use(errorHandler)
app.use(unknowEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server running', PORT)
})