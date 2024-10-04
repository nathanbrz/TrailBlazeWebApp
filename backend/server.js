
require ('dotenv').config()

const express = require('express')
const cors = require('cors'); // Import the CORS package

const mongoose = require('mongoose')
const uri = process.env.MONGODB_URI
const port = process.env.PORT || 4000 //port = 4000 unless specified in .env

const User = require('./dbmodels/user')
const Trip = require('./dbmodels/trip')
const tripRoutes = require('./routes/tripRoutes')

// Authentication
const firebaseRoutes = require('./routes/firebaseRoutes')

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

app.use('/api', tripRoutes)
app.use('/api/firebase', firebaseRoutes)

// Middleware

const corsOptions = {
    origin: 'http://localhost:3001', // Allow only this origin
    methods: ['GET', 'POST'], // Specify allowed methods
    credentials: true, // Allow credentials (if needed)
};

app.use(cors(corsOptions)); // Use the cors options

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
// try {
//     // const testuser = new User({
//     //     userID: new mongoose.Types.ObjectId(),
//     //     username: "cole_C",
//     //     email: "fake.email@gmail.com"
//     // })
//     // testuser.save()
// } catch (err) {
//     console.error(err)
// } finally {
//     User.find({username: "cole_C"})
//         .then((res) => {
//             console.log(res)
//         })
// }
