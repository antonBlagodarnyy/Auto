import type { ResultSetHeader, RowDataPacket } from "mysql2";
import con from "../db-connection.js";
import type { Response, Request } from "express";
import type { ICustomReq } from "../types/ICustomReq.js";

export const createProduct = (req: Request, res: Response) => {
  const customReq = req as ICustomReq;
  const userId = customReq.userId;
  const title = req.body.title;
  const description = req.body.description;
  const stock = req.body.stock;
  const price = req.body.stock;

  const sql =
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

export const getProducts = (req: Request, res: Response) => {
  const customReq = req as ICustomReq;
  const userId = customReq.userId;

  const sql = "select * from PRODUCT where USER_ID=?";

  con.query<RowDataPacket[]>(sql, [userId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(200).json({
        results: result.map((r) => {
          return {
            id: r.ID,
            title: r.TITLE,
            description: r.DESCRIPTION,
            stock: r.STOCK,
            price: r.PRICE,
          };
        }),
      });
    }
  });
};

export const deleteProduct = (req: Request, res: Response) => {
  const customReq = req as ICustomReq;
  const userId = customReq.userId;
  const id = req.body.productId;

  const sql = "delete from PRODUCT where ID = ? and USER_ID = ?";

  con.query<ResultSetHeader>(sql, [id, userId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else if (result.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Not authorized or product not found" });
    else return res.sendStatus(200);
  });
};

export const updateProduct = (req: Request, res: Response) => {
  const customReq = req as ICustomReq;
  const userId = customReq.userId;
  const productId = req.body.productId;
  const updates: { key: string; value: string }[] = req.body.changedValues;

  const setClause = updates.map((u) => `${u.key.toUpperCase()} = ?`).join(", ");

  const values = updates.map((u) => u.value);

  const sql = `
  UPDATE PRODUCT
  SET ${setClause}
  WHERE ID = ? AND USER_ID = ?
`;

  con.query(sql, [...values, productId, userId], (error) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.sendStatus(200);
    }
  });
};
