import type { ResultSetHeader, RowDataPacket } from "mysql2";
import con from "../db-connection.js";
import type { Request, Response } from "express";
import type { ICustomReq } from "../types/ICustomReq.js";

export const createMeeting = (req: Request, res: Response) => {
  const customReq = req as ICustomReq;
  const userId = customReq.userId;
  const name = req.body.name;
  const day_of_meeting = req.body.dayOfMeeting;

  var sql =
    "insert into MEETING (USER_ID, DAY_OF_MEETING, NAME) values (?,?,?);";

  con.query<ResultSetHeader>(
    sql,
    [userId, day_of_meeting, name],
    (error, result) => {
      if (error) return res.status(520).json({ error: error });
      else {
        return res.status(201).json({ meetingId: result.insertId });
      }
    }
  );
};

export const getMeetings = (req: Request, res: Response) => {
  const customReq = req as ICustomReq;
  const userId = customReq.userId;

  var sql = "select * from MEETING where USER_ID=?";

  con.query<RowDataPacket[]>(sql, [userId], (error, result) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.status(201).json({
        results: result,
      });
    }
  });
};
export const deleteMeeting = (req: Request, res: Response) => {
  const id = req.body.meetingId;

  var sql = "delete from MEETING where ID = ?";

  con.query(sql, [id], (error) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.send(200);
    }
  });
};

export const updateMeeting = (req: Request, res: Response) => {
  const meetingId = req.body.meeting;
  const name = req.body.name;

  var sql = `update MEETING
     set NAME = ?
     where ID = ?`;

  con.query(sql, [name, meetingId], (error) => {
    if (error) return res.status(520).json({ error: error.name });
    else {
      return res.send(200);
    }
  });
};
