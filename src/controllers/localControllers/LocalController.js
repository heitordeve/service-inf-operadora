const Local = require('../../models/localModels/Local')

class LocalController {

    async findbyId(req, res){

        const id = req.params.id

        const local = await Local.findById(id)

        if(!local){
            return res.status(404).json({ msg: 'Local não encontrado!' })
        }
        return res.status(200).json({ local });
    }
   

    async create(req, res){ 
        const  { name, description, type, infos, user, cityId } = req.body
    
         
        const userExists = await Local.findOne({ name: name })
    
        if(userExists) {
            return res.status(422).json({msg: `O local ${name}, já foi cadastrado. Favor verificar!`})
        }
    
        const local = new Local({
            name,
            description,
            type,
            infos,
            user,
            cityId
        })
    
        try {
            await local.save()
    
            return res.status(201).json({ msg: 'Local cadastrado com sucesso! ☺♥', local })
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

module.exports = LocalController;
