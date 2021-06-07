const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const User = require('../../db/schema/user')
const tokenHandler = require('../../middleware/auth')

router.post('/register',async (req, res) => {
    let {username, password, email} = req.body;
    password = await hashPassword(saltRounds,password);
    let user = await User.create({username,password,email});
    let token = await jwt.sign({ username:username, email:email }, process.env.JWT_SECRET);

    res.cookie('jwt',token,{maxAge:process.env.JWT_EXPIRE, httpOnly:true});
    res.status(200).send({success:"Welcome To Our Todos",token:token})
})

router.post('/login',async (req, res) => {
    let user = await User.findOne({email:req.body.email});
    if(!user) {
        res.status(401).send({err:"Unauthorize",tor:true})
        return
    }
    await bcrypt.compare(req.body.password, user.password).then(async function(result) {
        if(result == true){
            let token = await jwt.sign({ username:user.username, email:user.email }, process.env.JWT_SECRET);
            res.cookie('jwt',token,{maxAge:process.env.JWT_EXPIRE, httpOnly:true});
            res.status(200).send({token:token})
        }
        else{
            res.status(401).send({err:"Unauthorize",tor:true})
        }
    })
})

router.get('/logout',tokenHandler,async (req, res) => {
    let user = req.user

    if(!user) return res.status(401).send({err:"Unauthorize", data:{}})

    res.clearCookie("jwt");
    res.status(200).send("Logout Successfully")
})

const hashPassword = async (saltRounds, plainPassword) => {
    let hashedPassword;
    bcrypt.hash(plainPassword, saltRounds).then(function(result){
        hashedPassword = result
    })
    return hashedPassword
};


module.exports = router