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
app.get('/conviva-core-sdk.debug.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/conviva/conviva-core-sdk.debug.js'));
})
app.get('/conviva-core-sdk.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/conviva/conviva-core-sdk.js'));
})
app.get('/conviva-html5native-impl.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/conviva/conviva-html5native-impl.js'));
})
app.get('/conviva-googleima-module.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/conviva/conviva-googleima-module.js'));
})

app.use('/', express.static('dist'))

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})