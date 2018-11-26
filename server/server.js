let env = process.env.NODE_ENV || 'develpoment'

if(env==='development'){
    process.env.port = 3000
}

let express = require('express')
let bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')
let {mongoose} = require('./db/mongoose')
const _ = require('lodash')

let {ToDo} = require ('./models/todo')
let {User} = require('./models/user')
let {authenticate} = require('./middlewares/authenticate')


let app = express()

const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.post('/todos',(req,res)=>{
    let newTodo = new ToDo({
        text: req.body.text
    })

    newTodo.save()
           .then((data)=>res.status(200).send(data))
           .catch(error=>res.status(400).send(error))
})

app.get('/todos',(req,res)=>{
    ToDo.find()
        .then((todos)=>res.send({todos}))
        .catch((error)=>res.send(error))
})

app.get('/todos/:id',(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        res.status(404).send()
    }else ToDo.findById(req.params.id)
        .then((data)=>{
            if(!data){
                res.status(400).send()
            }
            res.send({data})})
        .catch(error=>res.send(error))
})

app.delete('/todos/:id',(req,res)=>{
    if(!ObjectID.isValid(req.params.id)){
        res.status(400).send("Id Not Valid")
    }else{
        ToDo.findByIdAndDelete(req.params.id)
            .then(data=>{
                if(!data){
                    res.status(404).send("No todos found!")
                }else res.send({data})
            })
            .catch(error=>res.send(error))
    }
})

app.patch('/todos/:id',(req,res)=>{
    let id = req.params.id;
    let body = _.pick(req.body,['text','completed'])
    if(!ObjectID.isValid(id)){
        res.status(400).send("Id not valid")
    }

    if(_.isBoolean(req.body.completed) && req.body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed=false
        body.completedAt = null
    }

    ToDo.findByIdAndUpdate(id,{$set:body},{new:true})
        .then((data)=>{
            if(!data){
                res.status(400).send("No Todos Found")
            }else res.send({data})
        })
        .catch(error=>res.status(404).send(error))
})

app.post('/user',(req,res)=>{
    let body = _.pick(req.body,['name','email'])
    let user = new User(body)
    user.save().then(()=>{
        return user.generateAuthToken()
    }).then((token)=>{
        res.header('x-auth',token).send(user)
    }).catch(e=>res.send(e))
})

app.get('/user/me',authenticate,(req,res)=>{
    res.send(req.user)
})

app.listen(port,()=>{
    console.log(`Server Up and running on port ${port}`)
})