import type { ResultSetHeader, RowDataPacket } from "mysql2";
import con from "../db-connection.js";
import type { Request, Response } from "express";
import type { ICustomReq } from "../types/ICustomReq.js";

export const createTask = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;
    const content = req.body.content;

    var sql = "insert into TASK (USER_ID, CONTENT, CHECKED) values (?,?,0);";

    const [result] = await con.query<ResultSetHeader>(sql, [userId, content]);
    return res.status(201).json({ taskId: result.insertId });
  } catch (err: any) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;

    var sql = "select * from TASK where USER_ID = ?";

    const [result] = await con.query<RowDataPacket[]>(sql, [userId]);
    return res.status(200).json({
      results: result.map((r) => {
        return { taskId: r.ID, content: r.CONTENT, checked: !!r.CHECKED };
      }),
    });
  } catch (err: any) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.body.taskId;
    const customReq = req as ICustomReq;
    const userId = customReq.userId;

    var sql = "delete  from TASK where ID = ? and USER_ID = ?";

    const [result] = await con.query<ResultSetHeader>(sql, [taskId, userId]);

    if (result.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Not authorized or task not found" });
    else return res.sendStatus(200);
  } catch (err: any) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export const checkTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.body.taskId;
    const customReq = req as ICustomReq;
    const userId = customReq.userId;

    var sql =
      "update TASK set CHECKED = !CHECKED where ID = ? and USER_ID = ?;";

    const [result] = await con.query<ResultSetHeader>(sql, [taskId, userId]);
    if (result.affectedRows === 0)
      return res
        .status(403)
        .json({ message: "Not authorized or task not found" });
    else return res.sendStatus(200);
  } catch (err: any) {
    console.error(err);
    return res.sendStatus(500);
  }
};
