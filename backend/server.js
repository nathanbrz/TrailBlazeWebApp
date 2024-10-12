
require ('dotenv').config()

const express = require('express')
const cors = require('cors');

const mongoose = require('mongoose')
const uri = process.env.MONGODB_URI
const port = process.env.PORT || 4000 //port = 4000 unless specified in .env

const User = require('./dbmodels/user')
const Trip = require('./dbmodels/trip')
const tripRoutes = require('./routes/tripRoutes')
const userRoutes = require('./routes/userRoutes')
const promptRoutes = require('./routes/promptRoutes')

const FRONTENDURL = process.env.FRONT_END_URL || 'http://localhost';
const FRONTENDPORT = process.env.FRONT_END_PORT || '3001'


// Authentication
const firebaseRoutes = require('./routes/firebaseRoutes')

// Create express app
const app = express()

// Middleware Setup
const corsOptions = {
    origin: `${FRONTENDURL}:${FRONTENDPORT}`,
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Server and Middleware setup
app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
    })

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the server' })
})


app.use('/api/trips', tripRoutes)
app.use('/api/users', userRoutes)
app.use('/api/prompts', promptRoutes)
app.use('/api/firebase', firebaseRoutes)


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
