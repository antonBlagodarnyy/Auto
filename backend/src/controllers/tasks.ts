import type { ResultSetHeader, RowDataPacket } from "mysql2";
import con from "../db-connection.js";
import type { Request, Response } from "express";
import type { ICustomReq } from "../types/ICustomReq.js";

export const createTask = (req: Request, res: Response) => {
  const customReq = req as ICustomReq;
  const userId = customReq.userId;
  const content = req.body.content;

  var sql = "insert into TASK (USER_ID, CONTENT, CHECKED) values (?,?,0);";

  con.query<ResultSetHeader>(sql, [userId, content], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(201).json({ taskId: result.insertId });
    }
  });
};

export const getTasks = (req: Request, res: Response) => {
  const customReq = req as ICustomReq;
  const userId = customReq.userId;

  var sql = "select * from TASK where USER_ID = ?";

  con.query<RowDataPacket[]>(sql, [userId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(200).json({
        results: result.map((r) => {
          return { taskId: r.ID, content: r.CONTENT, checked: !!r.CHECKED };
        }),
      });
    }
  });
};

export const deleteTask = (req: Request, res: Response) => {
  const taskId = req.body.taskId;
  const customReq = req as ICustomReq;
  const userId = customReq.userId;

  var sql = "delete  from TASK where ID = ? and USER_ID = ?";

  con.query<ResultSetHeader>(sql, [taskId, userId], (error, result) => {
    if (error) return res.status(520).json({ message: error.name });
    else if (result.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Not authorized or task not found" });
    else return res.sendStatus(200);
  });
};

export const checkTask = (req: Request, res: Response) => {
  const taskId = req.body.taskId;
  const customReq = req as ICustomReq;
  const userId = customReq.userId;

  var sql = "update TASK set CHECKED = !CHECKED where ID = ? and USER_ID = ?;";

  con.query<ResultSetHeader>(sql, [taskId, userId], (error, result) => {
    if (error) return res.status(520).json({ message: error.name });
    else if (result.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Not authorized or task not found" });
    else return res.sendStatus(200);
  });
};
