const express = require('express')
const app = express()
app.use(express.json())

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

app.get('/', (req, res) => {
    res.send('<h1>Hell from Victor</h1>')
})

app.get('/api/persons', (req, res) => {
    generatedId()
    res.json(phoneNumbers)
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phoneNumbers = phoneNumbers.filter(p => p.id !== id)
    response.status(204).end
})

const generatedId = () => {
    const maxId = phoneNumbers.length > 0 ? Math.max(...phoneNumbers.map(p => p.id)) : 0
    const randomId = phoneNumbers.length > 0 ? Math.floor(Math.random() * 1000) + 1 : 0

    return randomId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    console.log(body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    } else if (phoneNumbers.some((p) => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generatedId(),
    }
    phoneNumbers = phoneNumbers.concat(person)
    response.json(person)
})



const PORT = 3001
app.listen(PORT, () => {
    console.log('Server running')
})