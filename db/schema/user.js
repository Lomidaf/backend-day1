const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type:String,required:true,unique:true},
    email: {type:String, required:false,unique:true},
    password: {type:String,required:true},
    createAt: {type:Date,default:new Date()}
})


const User = mongoose.model('users',userSchema)

module.exports = User;