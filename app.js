const express = require('express')
const app = express()
const port = 3000
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/video', (req, res) => {
  res.sendFile(path.join(__dirname + '/video.html'));
})

app.use('/', express.static('dist'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})