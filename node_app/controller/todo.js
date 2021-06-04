const express = require('express')
const router = express.Router()
const todoSchema = require('../../db/schema/todo')
const mongoose = require('mongoose')
const Todo = mongoose.model('Todo',todoSchema)

router.get('/', async (req,res) => {
    let {select, sort, order, title, createAt} = req.query

    let query = await Todo.find({})
    console.log(query)

    query.select(select)

    res.status(200).json(query);
})

router.post('/', async (req,res) => {
    if(req.body.title == null){
        res.status(400).json({err:"Title can't be empty"});
        return;
    }
    let newTodo;
    try{
        newTodo = await Todo.create({ title: req.body.title})
    } catch (err) {
        res.status(400).json({"err":err.name,"data":err.massage})
        return
    }
    res.status(201).json(newTodo)
})

router.get('/:id', async (req,res) => {
    let query;
    try{
        query = await Todo.findOne({_id:req.params.id})
    }catch (err){
        res.status(400).json({"err":err.name,"data":err.massage});
        return;
    }
    if(!query){
        res.status(400).json({err:"Todo not found",data:`id:${req.params.id}`});
        return;
    }
    res.status(200).json(query);
})

router.put('/:id', async (req,res) => {
    let updatedTodo
    try{
        updatedTodo = await Todo.updateOne({_id:req.params.id},{title: req.body.title});
    } catch (err) {
        res.status(400).json({"err":err.name,"data":err.massage})
        return
    }
    if(updatedTodo.n == 0){
        res.status(400).json({err:"Todo not found",data:`id:${req.params.id}`})
        return;
    }
    res.status(200).json(updatedTodo);
})

router.delete('/:id', async (req,res,next) => {
    let deletedTodo
    try{
        deletedTodo = await Todo.deleteOne({_id:req.params.id});
    }   catch (err){
        res.status(400).json({"err":err.name,"data":err.massage})
        return;
    }
    if(deletedTodo.n == 0 ){
        res.status(400).json({err:"Todo not found",data:`id:${req.params.id}`})
        return;
    }
    res.json(deletedTodo);
})

module.exports = router;