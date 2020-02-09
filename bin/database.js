let mongoose = require('mongoose')

const server_address = 'mongodb+srv://ie_user:2306521a@iecluster-7aget.gcp.mongodb.net/test?retryWrites=true&w=majority'

class Database {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(`${server_address}`, { useNewUrlParser: true})
            .then(() => {
                console.log('Database connection made.')
            })
            .catch(err => {
                console.log(err)
                console.error('Database connection refused.')
            })
    }
}

module.exports = new Database()