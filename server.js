require('dotenv').config();

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors');

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(cors());
app.use(express.json())

const subscribersRouter = require('./routes/subscribers')
app.use('/subscribers', subscribersRouter)
const postRoutes = require('./routes/posts')
app.use('/posts', postRoutes)
const userRouter = require('./routes/user')
app.use('/user', userRouter)

// Serve static assets
app.use(express.static('public'))

app.listen(port, () => console.log('Server Started'))