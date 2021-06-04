const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
    order: {type:Number,default: 1},
    title: {type:String,required:true},
    createAt: {type:Date,default:new Date()}
})

todoSchema.pre('save', async function(next) {
    if(this.isNew){
        var todos = await Todo.find().sort('-order').limit(1);

        maxOrder = todos[0] ? todos[0].order : 0;
        this.order = maxOrder + 1;
    }
    next();
})

const Todo = mongoose.model('todos',todoSchema)

module.exports = todoSchema;