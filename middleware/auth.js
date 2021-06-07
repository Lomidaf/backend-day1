const jwt = require('jsonwebtoken');
const User = require('../db/schema/user')

const tokenHandler = async (req,res,next) => {
    let token;

    let authHeader = req.headers.authorization;

    if(authHeader && authHeader.startsWith('Bearer')){
        token = authHeader.slice(7,authHeader.length)
    }
    else if(req.cookies['jwt']){
        token = req.cookies['jwt']
    }

    if(!token) {
        return res.status(401).send({err:"Unauthorize",tor:true}) 
    }
    try {
        let payload = await jwt.verify(token, process.env.JWT_SECRET);

        let user = await User.findOne({email:payload.email});
        req.user = user;
        next()
    }
    catch(err) {
        console.log(err)
        return res.status(401).send({err:"Unauthorize",tor:true})
    }

}

module.exports = tokenHandler