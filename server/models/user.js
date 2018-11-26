let mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

let userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true,
        minLength:1
    },
    email:{
        type:String,
        require: true,
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password:{
        type:String,
        require:true,
        minLength:6,
    },
    tokens:[{
        access:{
            type:String,
            require:true
        },
        token:{
            type:String,
            require:true
        }
    }]
})

userSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    return _.pick(userObject,['_id','name','email'])
}

userSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth'
    var token = jwt.sign({_id:user._id.toHexString(),access},'123abc').toString()
    user.tokens = user.tokens.concat([{access,token}])
    return user.save().then(()=>{
        return token;
    })
}

userSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;
    try{
        decoded = jwt.verify(token,'123abc')
    }catch(e){
        return Promise.reject()
    }
    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    })
}

let User = mongoose.model('User',userSchema)

module.exports = {User}