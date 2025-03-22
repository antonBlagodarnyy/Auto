const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = (req, res)=>{
    res.status(200).json({message:"Create user works"});
}