import type { ResultSetHeader, RowDataPacket } from "mysql2";
import con from "../db-connection.js";
import type { Response, Request } from "express";
import type { ICustomReq } from "../types/ICustomReq.js";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;
    const title = req.body.title;
    const description = req.body.description;
    const stock = req.body.stock;
    const price = req.body.stock;

    const sql =
      "insert into PRODUCT (USER_ID, TITLE, DESCRIPTION, STOCK, PRICE) values (?,?,?,?,?);";

    const [result] = await con.query<ResultSetHeader>(sql, [
      userId,
      title,
      description,
      stock,
      price,
    ]);
    return res.status(201).json({ productId: result.insertId });
  } catch (err: any) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;

    const sql = "select * from PRODUCT where USER_ID=?";

    const [result] = await con.query<RowDataPacket[]>(sql, [userId]);

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
  } catch (err: any) {
    return res.sendStatus(500);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;
    const id = req.body.productId;

    const sql = "delete from PRODUCT where ID = ? and USER_ID = ?";

    const [result] = await con.query<ResultSetHeader>(sql, [id, userId]);

    if (result.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Not authorized or product not found" });
    else return res.sendStatus(200);
  } catch (err: any) {
    return res.sendStatus(500);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;
    const productId = req.body.productId;
    const updates: { key: string; value: string }[] = req.body.changedValues;

    const allowedFields = ["TITLE", "DESCRIPTION", "STOCK", "PRICE"];

    const filteredUpdates = updates.filter((u) =>
      allowedFields.includes(u.key.toUpperCase())
    );

    if (filteredUpdates.length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const setClause = updates
      .map((u) => `${u.key.toUpperCase()} = ?`)
      .join(", ");

    const values = filteredUpdates.map((u) => u.value);

    const sql = `
  UPDATE PRODUCT
  SET ${setClause}
  WHERE ID = ? AND USER_ID = ?
`;

    const [rows] = await con.query<ResultSetHeader>(sql, [
      ...values,
      productId,
      userId,
    ]);
    if (rows.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Not authorized or client not found" });
    else return res.sendStatus(200);
  } catch (err: any) {
    return res.sendStatus(500);
  }
};
