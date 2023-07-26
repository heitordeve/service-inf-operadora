require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./src/models/User')

const app = express()

app.use(express.json())


const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS

app.get('/', (req, res) => {
    res.status(200).json({msg: "Bem vindo a API"})
})

app.post('/auth/register', async (req, res) => {
    const  { name, email, password, confirmpassword } = req.body

    if(!name) {
        return res.status(422).json({msg: 'O nome é obrigatório'})
    }
    if(!email) {
        return res.status(422).json({msg: 'O e-mail é obrigatório'})
    }
    if(!password) {
        return res.status(422).json({msg: 'O password é obrigatório'})
    }
    if(password !== confirmpassword ) {
        return res.status(422).json({msg: 'As senhas não conferem'})
    }

    const userExists = await User.findOne({ email: email })

    if(userExists) {
        return res.status(422).json({msg: `E-mail ${email}, já cadastrado. Favor tentar outro e-mail!`})
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({
        name,
        email,
        password: passwordHash
    })

    try {
        await user.save()

        res.status(201).json(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: error})
    }

})

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0.cbtqe.mongodb.net/db_service`).then(() => {
    app.listen(3000)
    console.log('banco conectou')
}).catch((err) => console.log(err))

