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
      else return res.status(201).json({ message: "passed" });
    });
  });
};

exports.userLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  var sql = "SELECT * FROM user WHERE email = ?";
  con.query(sql, [email], (error, result) => {
    if (result.length == 0) {
      return res
        .status(401)
        .json({ message: "No user with that email was found" });
    } else {
      const user = result[0];
      
      return bcrypt
        .compare(password, user.PWD_HASH)
        .then((result) => {
 
          if (!result) {
            return res.status(401).json({ message: "Password incorrect" });
          } else {
            const token = jwt.sign(
              { email: user.email, userId: user.id },
              process.env.JWT_KEY,
              { expiresIn: "1h" }
            );
            res
              .status(200)
              .json({ token: token, expiresIn: 3600, userId: user.id });
          }
        });
    }
  });
};
