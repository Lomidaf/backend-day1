const express = require('express')
const router = express.Router()
const todoSchema = require('../../db/schema/todo')
const mongoose = require('mongoose')
const Todo = mongoose.model('todos',todoSchema)
const tokenHandler = require('../../middleware/auth')

router.use(tokenHandler)

router.post('/', async (req,res) => {
    console.log(req.user)
    if(req.body.title == null){
        res.status(400).json({err:"Title can't be empty"});
        return;
    }
    let newTodo;
    try{
        newTodo = await Todo.create({ title: req.body.title})
        console.log({ title: req.body.title})
    } catch (err) {
        return res.status(400).json({"err":err.name,"data":err.massage})
    }
    res.status(201).json({success:true,data:newTodo})
})

router.put('/:id', async (req,res) => {
    let result
    try{
        result = await Todo.updateOne({_id:req.params.id},{title: req.body.title});
    } catch (err) {
        res.status(400).json({"err":err.name,"data":err.massage})
        return
    }
    if(result.n == 0){
        res.status(400).json({err:"Todo not found",data:`id:${req.params.id}`})
        return;
    }
    let updatedTodo = await Todo.findOne({_id:req.params.id});
    res.status(200).json({success:true,data:updatedTodo});
})

router.delete('/:id', async (req,res,next) => {
    let deletedResult,deletedTodo
    try{
        deletedTodo = await Todo.findOne({_id:req.params.id});
        deletedResult = await Todo.deleteOne({_id:req.params.id});
    }   catch (err){
        res.status(400).json({"err":err.name,"data":err.massage})
        return;
    }
    if(deletedResult.n == 0 ){
        res.status(400).json({err:"Todo not found",data:`id:${req.params.id}`})
        return;
    }
    res.json({success:true,data:deletedTodo});
})

module.exports = router