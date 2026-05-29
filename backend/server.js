const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const noteRoutes = require('./routes/noteRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()

// app.use(cors())
app.use(
  cors({
    // origin: 'http://localhost:5173',
    origin: [
      'https://notes-app-three-rose.vercel.app',
      'http://localhost:5173'
    ],
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())

app.use('/api/notes', noteRoutes)
app.use('/api/auth', authRoutes)

app.get('/', (req, res) => {
  res.send('Backend + MongoDB Connected')
})

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Mongodb connected succeessfully')

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch(err => console.log(err))
