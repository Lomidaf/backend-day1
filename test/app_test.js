const req = require("supertest");
const controller = require("../node_app/controller/user")
const express = require("express")

beforeAll((done) => {
    connectDB()
    done()
})

afterAll((done) => {
    disconnectDB()
    done()
})