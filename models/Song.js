class Song {

    constructor(description) {
        // if description is null or undefined, we want to create an "empty" Song object.
        if (description) {
            this.id = description.id
            this.name = description.name
            this.artist = description.artist
            this.album = description.album
            this.duration = description.duration
            this.performances = this.convertPerformances(description.performances)
        }
        this.errors = []
    }

    isValid() {
        this.errors = []
        if (!this.name || this.name.length <= 2) {
            this.errors.push('The song name must contain at least three characters.')
        }
        if (!this.artist || this.artist.length <= 2) {
            this.errors.push('The artist name must contain at least three characters.')
        }
        if (!this.album || this.album.length <= 2) {
            this.errors.push('The album name must contain at least three characters.')
        }
        if (!this.performances) {
            this.errors.push('The performances must be provided as a non-empty array.')
        }
        //  else if (this.validatePerformances()) {
        //     this.performances = this.performances.map(performance => {
        //         const [month, day, year] = performance.split("/").map(Number)
        //         return new Date(year, month - 1, day).toDateString()
        //     })
        // }
        this.validatePerformances()
        const durationRegex = /^[0-5]?[0-9]:[0-5][0-9]$/
        if (!this.duration) {
            this.errors.push('The song must have a length.')
        } else if (!durationRegex.test(this.duration)) {
            this.errors.push('The song length must be in the format of [0-5][0-9]:[0-5][0-9]')
        }
        return this.errors.length <= 0
    }

    convertPerformances(performances) {
        // console.log(performances)
        if (Array.isArray(performances)) {
            return performances
        }
        else {
            try { 
                // console.log(performances)
                performances = JSON.parse(performances)
            } catch (e) {
                // console.log("Splitting performances")
                // console.log(performances)
                performances = performances.split(',')
                performances = JSON.stringify(performances)
                // let jsonStr = "'["
                // performances.forEach((str, idx, arr) => {
                //     if (idx == arr.length - 1) {
                //         jsonStr = jsonStr + '"' + str + '"'
                //     }
                //     else {
                //         jsonStr = jsonStr + '"' + str + '",'
                //     }
                // })
                // jsonStr = jsonStr + "]'"
                // performances = jsonStr
                // console.log(performances)
                try { 
                    performances = JSON.parse(performances)
                    // console.log(performances)
                }
                catch (e) {
                    console.log("Failed to convert!")
                    return
                }
            }
            return performances
        }
    }

    validatePerformances() {
        const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[01])\/(20[0-1][0-9]|202[0-4]|19[6-9][0-9])$/
        let invalid = 0
        if(!Array.isArray(this.performances)) {
            this.performances = this.convertPerformances(this.performances)
        }
        this.performances.forEach(performance => {
            if(!regex.test(performance)) {
                invalid += 1
            }
        })
        if (invalid > 0) {
            this.errors.push(`Performances must be valid dates in the years of 1960-2024. Found ${invalid} invalid dates!`)
            return false
        }
        return true
    }
}

module.exports = Song