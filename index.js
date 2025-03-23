const express = require('express')
const cookieParser = require("cookie-parser")
const app = express()
const port = 3000

const SongController = require('./contollers/SongController')
const songController = new SongController()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.sendFile('stats.html', { root: __dirname })
})

app.get('/stats.jsx', (req, res) => {
    res.sendFile('stats.jsx', { root: __dirname })
})

app.get('/stats.css', (req, res) => {
    res.sendFile('stats.css', { root: __dirname })
})

app.get('/songs', (req, res) => {
    songController.index(req, res)
})

/* Display a form to create a new song */
app.get('/songs/new', (req, res) => {
    songController.newSong(req, res)
})

/* Display details for one song.  
   :id represents a "route parameter" */
app.get('/songs/:id', (req, res) => {
    songController.show(req, res)
})

/* Create a new song */
app.post('/songs', (req, res) => {
    songController.create(req, res)
})

/* Display form to edit a song */
app.get('/songs/:id/edit', (req, res) => {
    songController.edit(req, res)
})

app.get('/songs/:id/delete', (req, res) => {
    songController.delete(req, res)
})

/* Update a song */
app.post('/songs/:id', (req, res) => {
    console.log('Update: ')
    console.log(req.body)
    console.log(req.params)
    songController.update(req, res)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))