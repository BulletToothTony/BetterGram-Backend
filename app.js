const express = require('express')
const cors = require('cors')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()
const app = express()
const port = 3000

const bodyParser = require('body-parser')
const userRoutes = require('./routes/user-routes')

app.use(bodyParser.json())
app.use(cors())


app.get('/hello', (req, res) => {
    console.log('hello')
    res.json('hello world')
})

app.use('/api/users', userRoutes)

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

mongoose.connect(`${process.env.DB_URI}`).then(() => {
    app.listen(3000, () => {
        console.log('Example app listening on 3000')
    })
})