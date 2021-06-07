const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../../db/schema/user')

router.use('/register',async (req, res) => {
    let {username, password, email} = req.body;
    password = hashPassword(saltRounds,password);
    // User.create({username,password,email});

    res.status(200).send(password)
})

router.use('/login',async (req, res) => {
    res.status(200).send("Index user")
})

router.use('/logout',async (req, res) => {
    res.status(200).send("Index user")
})

const hashPassword = (saltRounds, plainPassword) => {
    bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
        if(err) {
            throw new Error('Cant hash password')
        }
        else return hash
    });
};


module.exports = router