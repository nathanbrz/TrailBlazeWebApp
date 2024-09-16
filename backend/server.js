require ('dotenv').config()

const express = require('express')


// Create express app
const app = express()

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
    })

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the server' })
})

// Listen for requests
app.listen(4000, () => {
    console.log('Server is listening on port 4000')
})

