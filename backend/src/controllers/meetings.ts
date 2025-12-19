import type { ResultSetHeader, RowDataPacket } from "mysql2";
import con from "../db-connection.js";
import type { Request, Response } from "express";
import type { ICustomReq } from "../types/ICustomReq.js";
import type { IMeetings } from "../types/IMeetings.js";

export const createMeeting = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;
    const name = req.body.name;
    const day_of_meeting = req.body.dayOfMeeting;

    var sql =
      "insert into MEETING (USER_ID, DAY_OF_MEETING, NAME) values (?,?,?);";

    const [result] = await con.query<ResultSetHeader>(sql, [
      userId,
      day_of_meeting,
      name,
    ]);
    return res.status(201).json({ meetingId: result.insertId });
  } catch (err: any) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export const getMeetings = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;

    var sql = "select * from MEETING where USER_ID=?";

    const [rows] = await con.query<RowDataPacket[]>(sql, [userId]);

    let meetings: IMeetings = {};
    rows.forEach((e) => {
      const day = e.DAY_OF_MEETING;

      if (!meetings[day]) {
        meetings[day] = [];
      }

      meetings[day]!.push({
        id: e.ID,
        name: e.NAME,
      });
    });

    return res.status(200).json({
      results: meetings,
    });
  } catch (err: any) {
    return res.sendStatus(500);
  }
};
export const deleteMeeting = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;
    const id = req.body.meetingId;

    var sql = "delete from MEETING where ID = ? and USER_ID = ?";

    const [result] = await con.query<ResultSetHeader>(sql, [id, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    return res.sendStatus(200);
  } catch (err: any) {
    return res.sendStatus(500);
  }
};

export const updateMeeting = async (req: Request, res: Response) => {
  try {
    const customReq = req as ICustomReq;
    const userId = customReq.userId;
    const meetingId = req.body.meetingId;
    const name = req.body.name;

    var sql = `update MEETING
     set NAME = ?
     where ID = ? and USER_ID = ? `;

    const [result] = await con.query<ResultSetHeader>(sql, [
      name,
      meetingId,
      userId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    return res.sendStatus(200);
  } catch (err: any) {
    return res.sendStatus(500);
  }
};
