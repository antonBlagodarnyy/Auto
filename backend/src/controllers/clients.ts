import con from "../db-connection.js";
import type { Response, Request } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { ICustomReq } from "../types/ICustomReq.js";

export const createClient = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;

    const sql =
      "insert into CLIENT (USER_ID, NAME, PHONE, EMAIL) values (?,?,?,?);";

    const [result] = await con.query<ResultSetHeader>(sql, [
      userId,
      name,
      phone,
      email,
    ]);
    return res.status(201).json({ clientId: result.insertId });
  } catch (err: any) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export const getClients = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;

    const sql = "select * from CLIENT where USER_ID=?";

    const [rows] = await con.query<RowDataPacket[]>(sql, [userId]);
    res.status(200).json({
      results: rows.map((r) => ({
        id: r.ID,
        name: r.NAME,
        phone: r.PHONE,
        email: r.EMAIL,
      })),
    });
  } catch (err: any) {
    console.error(err);
    res.sendStatus(500);
  }
};

export const deleteClient = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;
    const clientId = req.body.clientId;

    const sql = "delete from CLIENT where ID = ? and USER_ID = ?";

    const [rows] = await con.query<ResultSetHeader>(sql, [clientId, userId]);

    if (rows.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Not authorized or client not found" });
    else return res.sendStatus(200);
  } catch {
    return res.sendStatus(500);
  }
};

export const updateClient = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;
    const clientId = req.body.clientId;
    const updates: { key: string; value: string }[] = req.body.changedValues;

    const allowedFields = ["NAME", "PHONE", "EMAIL"];

    const filteredUpdates = updates.filter((u) =>
      allowedFields.includes(u.key.toUpperCase())
    );

    if (filteredUpdates.length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const setClause = filteredUpdates
      .map((u) => `${u.key.toUpperCase()} = ?`)
      .join(", ");

    const values = filteredUpdates.map((u) => u.value);

    const sql = `
  UPDATE CLIENT
  SET ${setClause}
  WHERE ID = ? AND USER_ID = ?
`;

    const [rows] = await con.query<ResultSetHeader>(sql, [
      ...values,
      clientId,
      userId,
    ]);

    if (rows.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Not authorized or client not found" });
    else return res.sendStatus(200);
  } catch (err) {
    return res.sendStatus(500);
  }
};
