const User = require('../../models/userModels/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserController {

    async findbyId(req, res){

        const id = req.params.id

        const user = await User.findById(id, '-password')

        if(!user){
            return res.status(404).json({ msg: 'Usuário não encontrado!' })
        }
        return res.status(200).json({ user });
    }

   

    async create(req, res){ 
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
    
            return res.status(201).json({ msg: 'Usuário cadastrado com sucesso! ☺♥', user })
        } catch (error) {
            console.log(error)
            return res.status(500).json({msg: error})
        }
    
    }

    async login(req, res){

        const {email, password} = req.body
    
        if(!email) {
            return res.status(422).json({msg: 'O e-mail é obrigatório'})
        }
        if(!password) {
            return res.status(422).json({msg: 'O password é obrigatório'})
        }
    
        const user = await User.findOne({ email: email })
    
        if(!user) {
            return res.status(404).json({msg: `Usuário não encontrado!`})
        }
    
        const checkPassword = await bcrypt.compare(password, user.password)
    
        if(!checkPassword) {
            return res.status(422).json({ msg: 'Senha inválida' })
        }
    
        try {
            const secret = process.env.SECRET
    
            const token = jwt.sign({
                id: user._id,
            },
            secret,
            )
    
            return res.status(200).json({ msg: 'Autenticação realizada com sucesso', token })
    
        } catch (error) {
            console.log(error)
            return res.status(500).json({msg: error})
        }
    
    }
        
}

module.exports = UserController;

