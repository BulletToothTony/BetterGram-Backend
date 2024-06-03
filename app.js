const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.get('/hello', (req, res) => {
    console.log('hello')
    res.json('hello world')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})