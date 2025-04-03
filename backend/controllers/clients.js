const con = require("./connection");

exports.createClient = (req, res) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;

  var sql =
    "insert into CLIENT (USER_ID, NAME, PHONE, EMAIL) values (?,?,?,?);";

  con.query(sql, [userId, name, phone, email], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(201).json({
        product: {
          id: result.insertId,
          userId: userId,
          name: name,
          phone: phone,
          email: email,
        },
      });
    }
  });
};

exports.getClients = (req, res) => {
  const userId = req.query.userId;

  var sql = "select * from CLIENT where USER_ID=?";

  con.query(sql, [userId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      let clients = [];
      result.forEach((e) => {
        clients.push({
          id: e.ID,
          name: e.NAME,
          phone: e.PHONE,
          email: e.EMAIL,
        });
      });
      return res.status(201).json({
        results: clients,
      });
    }
  });
};

exports.deleteClient = (req, res) => {
  const id = req.query.productId;

  var sql = "delete from CLIENT where ID = ?";

  con.query(sql, [id], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(201).json({ message: "Client deleted" });
    }
  });
};

exports.updateClient = (req, res) => {
  const clientId = req.body.clientId;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;

  var sql = `update CLIENT
     set NAME = ?, PHONE = ?, EMAIL = ? 
     where ID = ?`;

  con.query(sql, [name, phone, email, clientId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(201).json({
        client: {
          id: result.insertId,
          name: name,
          phone: phone,
          email: email,
        },
      });
    }
  });
};
