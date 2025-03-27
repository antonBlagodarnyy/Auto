const con = require("./connection");

exports.createProduct = (req, res) => {
  const userId = req.body.userId;
  const title = req.body.title;
  const description = req.body.description;
  const stock = req.body.stock;
  const price = req.body.stock;

  var sql =
    "insert into PRODUCT (USER_ID, TITLE, DESCRIPTION, STOCK, PRICE) values (?,?,?,?,?);";

  con.query(
    sql,
    [userId, title, description, stock, price],
    (error, result) => {
      if (error) return res.status(520).json({ error: error.name });
      else {
        return res.status(201).json({
          product: {
            id: result.insertId,
            userId: userId,
            title: title,
            description: description,
            stock: stock,
            price: price,
          },
        });
      }
    }
  );
};

exports.getProducts = (req, res) => {
  const userId = req.query.userId;

  var sql = "select * from PRODUCT where USER_ID=?";

  con.query(sql, [userId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      let products = [];
      result.forEach((e) => {
        products.push({
          id: e.ID,
          title: e.TITLE,
          description: e.DESCRIPTION,
          stock: e.STOCK,
          price: e.PRICE,
        });
      });
      return res.status(201).json({
        results: products,
      });
    }
  });
};
