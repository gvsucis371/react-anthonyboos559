const sqlite3 = require('sqlite3').verbose()
const Song = require('../models/Song')

class SongDB {

    static initialize() {
        this.sqliteDB.serialize(() => {
            this.sqliteDB.run('CREATE TABLE Songs (id INTEGER PRIMARY KEY, name TEXT NOT NULL, artist TEXT NOT NULL, album TEXT NOT NULL, duration TEXT NOT NULL, performances TEXT NOT NULL);')
            this.sqliteDB.run(`INSERT INTO Songs (name, artist, album, duration, performances) VALUES (?, ?, ?, ?, ?)`,
                ["Possum", "Phish", "The Man Who Stepped Into Yesterday", "3:45", JSON.stringify(["10/26/1989", "08/03/2022", "08/06/2024"])])
            this.sqliteDB.run(`INSERT INTO Songs (name, artist, album, duration, performances) VALUES (?, ?, ?, ?, ?)`,
                ["Arrow", "Goose", "Dripfield", "5:51", JSON.stringify(["12/21/2019", "09/16/2023", "05/06/2024"])])
            this.sqliteDB.run(`INSERT INTO Songs (name, artist, album, duration, performances) VALUES (?, ?, ?, ?, ?)`,
                ["Box of Rain", "Grateful Dead", "American Beauty", "5:18", JSON.stringify(["09/17/1970", "02/09/1973", "07/03/2015"])])
            this.sqliteDB.run(`INSERT INTO Songs (name, artist, album, duration, performances) VALUES (?, ?, ?, ?, ?)`,
                ["Punch You in the Eye", "Phish", "The Man Who Stepped Into Yesterday", "5:45", JSON.stringify(["08/17/1989", "11/11/1998", "12/31/2023"])])
            this.sqliteDB.run(`INSERT INTO Songs (name, artist, album, duration, performances) VALUES (?, ?, ?, ?, ?)`,
                ["Thatch", "Goose", "Everything Must Go", "6:21", JSON.stringify(["11/13/2022", "06/23/2023", "10/06/2023"])])
            this.sqliteDB.run(`INSERT INTO Songs (name, artist, album, duration, performances) VALUES (?, ?, ?, ?, ?)`,
                ["Help on the Way", "Grateful Dead", "Blues for Allah", "7:57", JSON.stringify(["06/17/1975", "06/28/1992", "07/03/2015"])])
            this.sqliteDB.run(`INSERT INTO Songs (name, artist, album, duration, performances) VALUES (?, ?, ?, ?, ?)`,
                ["Free", "Phish", "Billy Breathes", "5:13", JSON.stringify(["05/16/1995", "06/05/2022", "08/06/2024"])])
        })
    }

    static allSongs() {
        return new Promise((resolve, _reject) => {
            this.sqliteDB.all('SELECT * from Songs', (err, response) => {
                console.log('Select all')
                console.log(err)
                console.log(response)
                resolve(response.map((item) => new Song(item)))
            })
        })
    }

    static find(id) {
        return new Promise((resolve, reject) => {
            this.sqliteDB.all(`SELECT * from Songs where (id == ${id})`, (err, rows) => {
                if (rows.length >= 1) {
                    resolve(new Song(rows[0]))
                } else {
                    reject(`Id ${id} not found`)
                }
            })
        })
    }

    static create(description) {
        console.log("creating song")
        let newSong = new Song(description)
        if (newSong.isValid()) {
            return new Promise((resolve, _reject) => {
                // Note:  In order to have access to this.lastID, you have to use function instead of the new arrow syntax.
                // See https://github.com/TryGhost/node-sqlite3/wiki/API
                console.log(newSong.performances)
                console.log(Array.isArray(newSong.performances))
                console.log(JSON.stringify(newSong.performances))
                this.sqliteDB.run(`INSERT INTO Songs (name, artist, album, duration, performances) VALUES ("${newSong.name}", "${newSong.artist}", "${newSong.album}", "${newSong.duration}", "${newSong.performances}")`,
                    function(_err, _data) {
                        console.log(_err)
                        console.log(_data)
                        newSong.id = this.lastID
                        resolve(newSong)
                    })
            })
        } else {
            return newSong
        }
    }

    static delete(id) {
        this.sqliteDB.run(`DELETE FROM Songs where id="${id}"`)
    }

    static update(song) {
        this.sqliteDB.run(`UPDATE Songs SET name="${song.name}", artist="${song.artist}", album="${song.album}", duration="${song.duration}", performances="${song.performances}" where id="${song.id}"`,
            function(_err, _data) {
            console.log(_err)
            console.log(_data)
        })
    }

}

SongDB.sqliteDB = new sqlite3.Database(__dirname + '/songs.sqlite')
module.exports = SongDB