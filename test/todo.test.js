const request = require('supertest')
const express = require('express')
const echoRoute = require('../node_app/controller/echo');
const todoRoute = require('../node_app/controller/todo');
const app = express()
const {connectDB, disconnectDB} = require('../db/dbutils')
const assert = require('assert');

const dotenv = require('dotenv');
const { response } = require('express');
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/echo',echoRoute);
app.use('/todo',todoRoute);

beforeAll(() => {
    connectDB()
})

let testTodoId;

describe('GET /todo', function() {
    it('responds with json', function(done) {
        request(app).get('/todo').set('Accept','application/json').expect('Content-Type', /json/).expect(200, done);
    })
})

describe('POST /todo', function() {
    it('Succesfully request! responds with json', function(done) {
        request(app).post('/todo').send({title: "Testing here"}).set('Accept','application/json').expect('Content-Type', /json/).expect(201)
        .then(response => {
            testTodoId = response.body._id
            done()
        })
        .catch(err => done(err));
    })
    it('Unsuccesfully request because empty title', function(done) {
        request(app).post('/todo').send().set('Accept','application/json').expect('Content-Type', /json/).expect(400)
        .end(function(err,res){
            if(err) return done(err)
            return done()
        });
    })
})

describe('Get /todo/:id', function() {
    it('Succesfully get newly created todo',function(done) {
        request(app).get(`/todo/${testTodoId}`).set('Accept','application/json').expect('Content-Type', /json/).expect(200)
        .then(response => {
            assert.strictEqual(response.body.title, "Testing here")
            done()
        })
        .catch(err => done(err));
    })

    it('Get not exist todo',function(done) {
        request(app).get(`/todo/60b760a60a439164fc25e20f`).set('Accept','application/json').expect('Content-Type', /json/).expect(400)
        .catch(err => done(err))
        done()
    })
})

describe('Update /todo/:id', function() {
    it('Succesfully update newly created todo',function(done) {
        request(app).put(`/todo/${testTodoId}`).send({title:"Testing Change"}).set('Accept','application/json').expect('Content-Type', /json/).expect(200)
        .then(response => {
            assert.strictEqual(response.body.nModified, 1)
            done()
        })
        .catch(err => done(err));
    })
    it('Update not exist todo',function(done) {
        request(app).put(`/todo/60b760a60a439164fc25e20f`).send({title:"Testing Change"}).set('Accept','application/json').expect('Content-Type', /json/).expect(400)
        .end(function(err,res){
            if(err) return done(err)
            return done()
        });
        done()
    })
})

describe('Delete /todo/:id', function() {
    it('Succesfully delete newly created todo',function(done) {
        request(app).delete(`/todo/${testTodoId}`).set('Accept','application/json').expect('Content-Type', /json/).expect(200)
        .end(function(err,res){
            if(err) return done(err)
            return done()
        });
    })
    it('Delete not exist todo',function(done) {
        request(app).delete(`/todo/${testTodoId}`).set('Accept','application/json').expect('Content-Type', /json/).expect(400)
        .end(function(err,res){
            if(err) return done(err)
            return done()
        });
    })
})



afterAll((done) => {
    disconnectDB()
    done()
})