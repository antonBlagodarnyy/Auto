import con from "../db-connection.js";
import type { Response, Request  } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { ICustomReq } from "../types/ICustomReq.js";

export const createClient = (req: Request, res: Response) => {
  const customReq = req as ICustomReq;
  const userId = customReq.userId;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;

  const sql =
    "insert into CLIENT (USER_ID, NAME, PHONE, EMAIL) values (?,?,?,?);";

  con.query<ResultSetHeader>(
    sql,
    [userId, name, phone, email],
    (error, result) => {
      if (error) return res.status(520).json({ error: error.name });
      else {
        return res.status(201).json({ clientId: result.insertId });
      }
    }
  );
};

export const getClients = (req: Request, res: Response) => {
  const customReq = req as ICustomReq;
  const userId = customReq.userId;

  const sql = "select * from CLIENT where USER_ID=?";

  con.query<RowDataPacket[]>(sql, [userId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(200).json({
        results: result.map((r) => {
          return {
            id: r.ID,
            name: r.NAME,
            phone: r.PHONE,
            email: r.EMAIL,
          };
        }),
      });
    }
  });
};

export const deleteClient = (req: Request, res: Response) => {
  const customReq = req as ICustomReq;
  const userId = customReq.userId;
  const clientId = req.body.clientId;

  const sql = "delete from CLIENT where ID = ? and USER_ID = ?";

  con.query<ResultSetHeader>(sql, [clientId, userId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else if (result.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Not authorized or client not found" });
    else return res.sendStatus(200);
  });
};

export const updateClient = (req: Request, res: Response) => {
  const customReq = req as ICustomReq;
  const userId = customReq.userId;
  const clientId = req.body.clientId;
  const updates: { key: string; value: string }[] = req.body.changedValues;

  const setClause = updates.map((u) => `${u.key.toUpperCase()} = ?`).join(", ");

  const values = updates.map((u) => u.value);

  const sql = `
  UPDATE CLIENT
  SET ${setClause}
  WHERE ID = ? AND USER_ID = ?
`;

  con.query(sql, [...values, clientId, userId], (error) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.sendStatus(200);
    }
  });
};
