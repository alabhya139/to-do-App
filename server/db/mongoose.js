let mongoose = require('mongoose')

mongoose.Promise = global.Promise

mongoose.connect('mongodb://alabhya:iwanna143@ds115664.mlab.com:15664/to-do',{useNewUrlParser:true})

module.exports ={
    mongoose
}