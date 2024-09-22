
require ('dotenv').config()

const express = require('express')

const mongoose = require('mongoose')
const uri = process.env.MONGODB_URI
const port = process.env.PORT || 4000 //port = 4000 unless specified in .env

const User = require('./dbmodels/user')
const Trip = require('./dbmodels/trip')

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

// Connect to the Database, then listen for requests
async function connect() {
    try {
        await mongoose.connect(uri)
        console.log("Connected to MongoDB!")
    } catch (err) {
        console.error(err)
    } finally {
        app.listen(port, () => {
            console.log('Server is listening on port' + port)
        })
    }
}
connect()

// Here is some example code showing how to create and query MongoDB models.
try {
    // const testuser = new User({
    //     userID: new mongoose.Types.ObjectId(),
    //     username: "cole_C",
    //     email: "fake.email@gmail.com"
    // })
    // testuser.save()
} catch (err) {
    console.error(err)
} finally {
    User.find({username: "cole_C"})
        .then((res) => {
            console.log(res)
        })
}
