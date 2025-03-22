const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const con = require("./connection");

exports.createUser = (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const authType = req.body.authType;
  const externalId = req.body.externalId;

  bcrypt.hash(password, 10).then((hash) => {
    var sql =
      "insert into USER (USERNAME, EMAIL, PWD_HASH, AUTH_TYPE, EXTERNAL_ID) values (?,?,?,?,?)";
    con.query(sql, [username, email, hash, authType, externalId], (err) => {
      if (err) return res.status(520).json({ error: err.name });
      else  return res.status(201).json({message: "passed"});
    });
  });
};
