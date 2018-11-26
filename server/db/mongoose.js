let mongoose = require('mongoose')

let env = process.env.NODE_ENV || 'development'

mongoose.set('useCreateIndex',true)

mongoose.Promise = global.Promise
if(env==='development'){
    let dbURI = 'mongodb://localhost:27017/toDoApp'
    mongoose.connect(dbURI,{useNewUrlParser:true})
}else{
    let dbURI = 'mongodb://alabhya:iwanna143@ds115664.mlab.com:15664/to-do'
    mongoose.connect(dbURI,{useNewUrlParser:true})
}





module.exports ={
    mongoose
}