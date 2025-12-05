import type { ResultSetHeader, RowDataPacket } from "mysql2";
import con from "../db-connection.js";
import type { Request, Response } from "express";
import type { ICustomReq } from "../types/ICustomReq.js";

export const createProduct = (req: ICustomReq, res: Response) => {
  const userId = req.userId;
  const title = req.body.title;
  const description = req.body.description;
  const stock = req.body.stock;
  const price = req.body.stock;

  var sql =
    "insert into PRODUCT (USER_ID, TITLE, DESCRIPTION, STOCK, PRICE) values (?,?,?,?,?);";

  con.query<ResultSetHeader>(
    sql,
    [userId, title, description, stock, price],
    (error, result) => {
      if (error) return res.status(520).json({ error: error.name });
      else {
        return res.status(201).json({ productId: result.insertId });
      }
    }
  );
};

export const getProducts = (req: ICustomReq, res: Response) => {
  const userId = req.userId;

  var sql = "select * from PRODUCT where USER_ID=?";

  con.query<RowDataPacket[]>(sql, [userId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(201).json({
        results: result,
      });
    }
  });
};

export const deleteProduct = (req: Request, res: Response) => {
  const id = req.body.productId;

  var sql = "delete from PRODUCT where ID = ?";

  con.query(sql, [id], (error) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(200);
    }
  });
};

export const updateProduct = (req: Request, res: Response) => {
  const productId = req.body.productId;
  const title = req.body.title;
  const description = req.body.description;
  const stock = req.body.stock;
  const price = req.body.price;

  var sql = `update PRODUCT
     set TITLE = ?, DESCRIPTION = ?, STOCK = ?, PRICE = ?
     where ID = ?`;

  con.query(sql, [title, description, stock, price, productId], (error) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.send(200);
    }
  });
};
