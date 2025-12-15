const Express = require('express')

const route = Express.Router()

const { SignUp, LogIn } = require('../Controller/Login.Controller')
const { verToken } = require('../Utils/Token')
const db = require('../DataBase/db')

route.post('/signup', SignUp) 
route.post('/login', LogIn)
route.get('/verify/:token', (req, res) => {
    const {token} = req.params
    try{
        const decoded = verToken(token)
        query = 'UPDATE Usuarios SET verificado = 1, tokenEmail = NULL WHERE email = ?'
        db.run(query, [decoded.email], (err) => {
            if(err){
                console.error('paso ago mal :(')
                return res.status(500).send("aww :(")
            }
            res.send("<h1>muy bien cumpa</h1>")
        })
    } catch(err) {
        console.error('Token inválido:', err);
        return res.status(400).send('Token inválido o expirado');
    }
})

module.exports = route;