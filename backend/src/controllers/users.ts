import type { ResultSetHeader, RowDataPacket } from "mysql2";
import con from "../db-connection.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const hash = await bcrypt.hash(password, 10);

    const sql = "insert into USER (USERNAME, EMAIL, PWD_HASH) values (?,?,?)";

    const [result] = await con.query<ResultSetHeader>(sql, [
      username,
      email,
      hash,
    ]);

    const token = jwt.sign({ userId: result.insertId }, process.env.JWT_KEY!, {
      expiresIn: "1h",
    });
    return res
      .status(201)
      .json({ token: token, expiresIn: 3600, userId: result.insertId });
  } catch (err: any) {
    if (err.code == "ER_DUP_ENTRY")
      return res.status(409).json({ message: "Email already exists" });
    else return res.status(500).json({ message: "Something went wrong" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const sql = "select * from USER where EMAIL = ?";
    const [result] = await con.query<RowDataPacket[]>(sql, [email]);

    if (result.length == 0) {
      return res
        .status(401)
        .json({ message: "No user with that email was found" });
    } else {
      const user = result[0];

      const valid = await bcrypt.compare(password, user!.PWD_HASH);
      if (!valid) {
        return res.status(401).json({ message: "Password incorrect" });
      } else {
        const token = jwt.sign({ userId: user!.ID }, process.env.JWT_KEY!, {
          expiresIn: "1h",
        });
        res
          .status(200)
          .json({ token: token, expiresIn: 3600, userId: user!.ID });
      }
    }
  } catch (err: any) {
    return res.status(500).json({ message: "Database error" });
  }
};
