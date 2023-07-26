const express = require('express')
const router = require('./routes')
const Database = require('./src/config/database/index')

const app = express()
app.use(express.json())
app.use(router);
app.listen(3000)
