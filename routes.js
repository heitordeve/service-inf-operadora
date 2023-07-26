const express = require('express')
const router = express.Router()
const UserController = require('./src/controllers/userControllers/UserController')
const LocalController = require('./src/controllers/localControllers/LocalController')

function checkToken(req, res, next){
    const autHeader = req.headers['authorization']
    const token = autHeader && autHeader.split(" ")[1]


    if(!token){
        return res.status(401).json({ msg: 'Acesso Negado!' })
    }

    try {
        const secret = process.env.SECRET

        jwt.verify(token, secret)

        next()

    } catch (error) {
        res.status(400).json({msg: "Token Inválido!"})
    }
}

const userController = new UserController();
const localController = new LocalController();

//Rotas de Usuários

//Privadas
router.get('/user/:id', checkToken, userController.findbyId)
// //Públicas
router.post('/auth/register', userController.create) 
router.post('/auth/login', userController.login) 

// ---------------------------------------------------------------------------------------------

//Rotas de Locais

//Privadas
// router.get('/user/:id', checkToken, userController.findbyId)

//Públicas
router.post('/auth/local',checkToken, localController.create) 


module.exports = router; 