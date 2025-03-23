const Song = require('../models/Song')
const SongDB = require('../database/SongDB')

class SongController {

    index(req, res) {
        SongDB.allSongs().then((songsArray) => {
            if (req.cookies.history) {
                let history = JSON.parse(req.cookies.history).map(Number)
                let songsHistory = []
                Promise.all(history.map((id) => SongDB.find(id)))
                    .then((songsHistory) => {
                        res.render('songIndex', { songs: songsArray, history: songsHistory })
                    })
            }
            else {
                res.render('songIndex', { songs: songsArray, history: null })
            }
        })
    }

    show(req, res) {
        let id = req.params.id
        SongDB.find(id).catch( (_error) => {
            res.send('Could not find song with id of ' + id)
        }).then( (song) => {
            let viewed
            if (req.cookies.history) {
                viewed = JSON.parse(req.cookies.history)
                if (!viewed.includes(id)) {
                    viewed.unshift(id)
                    if (viewed.length > 3) {
                        viewed.pop()
                    }
                }
                else {
                    let idx = viewed.indexOf(id)
                    viewed.splice(idx, 1)
                    viewed.unshift(id)
                }
            }
            else {
                viewed = [id]
            }
            console.log(viewed)
            res.cookie('history', JSON.stringify(viewed))
            res.render('songShow', { song: song })
        })
    }

    newSong(req, res) {
        console.log('Controller::newSong ')
        res.render('songNew', { song: new Song() })
    }

    create(req, res) {
        console.log('About to create song')
        console.log(req.body)
        SongDB.create(req.body.song).then( (newSong) => {
            if (newSong.isValid()) {
    
                // Send a redirect to the "show" route for the new song.
                res.writeHead(302, { 'Location': `/songs/${newSong.id}` })
                res.end()
            } else {
                res.render('songNew', { song: newSong })
            }
        })
    }

    delete(req, res) {
        console.log('About to delete song')
        SongDB.delete(req.params.id)
        res.writeHead(302, { 'Location': '/songs' })
        res.end()
    }

    edit(req, res) {
        let id = req.params.id
        SongDB.find(id).then((song) => {
            if (!song) {
                res.send('Could not find song with id of ' + id)
            } else {
                res.render('songEdit', { song: song })
            }
        })
    }

    update(req, res) {
        let id = req.params.id
        SongDB.find(id).then( (song) => {

            let testSong = new Song(req.body.song)
            if (!testSong.isValid()) {
                testSong.id = song.id
                res.render('songEdit', { song: testSong })
                return;
            }
    
            if (!song) {
                res.send('Could not find song with id of ' + id)
            } else {
                song.name = req.body.song.name
                song.artist = req.body.song.artist
                song.album = req.body.song.album
                song.duration = req.body.song.duration
                song.performances = req.body.song.performances
    
                console.log('About to call update')
                console.log(song)
                SongDB.update(song)
    
                // Send a redirect to the "show" route for the new song.
                res.writeHead(302, { 'Location': `/songs/${song.id}` })
                res.end()
            }
        })
    }

}

module.exports = SongController