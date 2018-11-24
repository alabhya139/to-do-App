let express = require('express')
let bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

let {mongoose} = require('./db/mongoose')
let {ToDo} = require ('./models/todo')
let {User} = require('./models/user')


let app = express()

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

app.listen('3000',()=>{
    console.log("Server Up and running on port 3000")
})