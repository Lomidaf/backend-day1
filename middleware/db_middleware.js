const User = require("../node_app/controller");

exports.module = (req,res,next) => {
    req.db = {User:User}
    next()
}