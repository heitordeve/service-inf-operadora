require('dotenv').config()
const mongoose = require('mongoose')

const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

const Database = mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.cbtqe.mongodb.net/db_service`).then(() => {
    
    console.log('banco conectou')
    }).catch((err) => console.log(err))


module.exports = Database
