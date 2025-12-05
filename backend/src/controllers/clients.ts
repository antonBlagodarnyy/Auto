import con from "../db-connection.js";
import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export const createClient = (req: Request, res: Response) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;

  var sql =
    "insert into CLIENT (USER_ID, NAME, PHONE, EMAIL) values (?,?,?,?);";

  con.query<ResultSetHeader>(sql, [userId, name, phone, email], (error,result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(201).json({clientId:result.insertId});
    }
  });
};

export const getClients = (req: Request, res: Response) => {
  const userId = req.query.userId;

  var sql = "select * from CLIENT where USER_ID=?";

  con.query<RowDataPacket[]>(sql, [userId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(200).json({
        results: result,
      });
    }
  });
};

export const deleteClient = (req: Request, res: Response) => {
  const id = req.body.id;

  var sql = "delete from CLIENT where ID = ?";

  con.query(sql, [id], (error) => {
    if (error) return res.status(520).json({ error: error.name });
    else res.send(200);
  });
};

export const updateClient = (req: Request, res: Response) => {
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
      return res.send(200);
    }
  });
};
