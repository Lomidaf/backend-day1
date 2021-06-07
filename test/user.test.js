const request = require("supertest");
const controller = require("../node_app/controller/user")
const express = require("express");
const userRoute = require("../node_app/controller/user")
const assert = require('assert');

const app = express()

const dotenv = require('dotenv');
dotenv.config()
require("./app_test")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/user',userRoute);

let token 

describe('POST /user/register', function() {
    it('Register User', function(done) {
        request(app).post('/user/register').send({username:"puttipat",email:"hello@gmail.com",password:"1234"}).set('Accept','application/json').expect('Content-Type', /json/).expect(200, done)
        .expect(response => {
            assert.strictEqual(response.body.data.username,"puttipat")
        })
    })
})

describe('POST /user/login', function() {
    it('Login User', function(done) {
        request(app).post('/user/login').send({email:"hello@gmail.com",password:"1234"}).set('Accept','application/json').expect('Content-Type', /json/).expect(200, done)
        .expect(response => {
            token = response.body.token
        })
    })
})

describe('GET /user/logout', function() {
    it('Logout User', function(done) {
        request(app).get('/user/logout').set('Accept','application/json').set('Authorization',`Bearer ${token}`).expect('Content-Type', 'text/html; charset=utf-8').expect(200, done)
        .expect(response => {
            token = response.body.token
        })
    })
})

// describe('Logout /user/logout', function() {
//     it()
// })
