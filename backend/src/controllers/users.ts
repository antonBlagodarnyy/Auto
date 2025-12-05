import type { ResultSetHeader, RowDataPacket } from "mysql2";
import con from "../db-connection.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = (req: Request, res: Response) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  bcrypt.hash(password, 10).then((hash) => {
    var sql = "insert into USER (USERNAME, EMAIL, PWD_HASH) values (?,?,?)";

    con.query<ResultSetHeader>(sql, [username, email, hash], (err, result) => {
      if (err) {
        if (err.code == "ER_DUP_ENTRY")
          return res.status(409).json({ message: "Email already exists" });
        else return res.status(500).json({ message: "Something went wrong" });
      } else {
        const token = jwt.sign(
          { userId: result.insertId },
          process.env.JWT_KEY!,
          { expiresIn: "1h" }
        );
        return res
          .status(201)
          .json({ token: token, expiresIn: 3600, userId: result.insertId });
      }
    });
  });
};

export const userLogin = (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  var sql = "select * from USER where EMAIL = ?";
  con.query<RowDataPacket[]>(sql, [email], (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length == 0) {
      return res
        .status(401)
        .json({ message: "No user with that email was found" });
    } else {
      const user = result[0];

      return bcrypt.compare(password, user!.PWD_HASH).then((result) => {
        if (!result) {
          return res.status(401).json({ message: "Password incorrect" });
        } else {
          const token = jwt.sign(
            { userId: user!.ID },
            process.env.JWT_KEY!,
            { expiresIn: "1h" }
          );
          res
            .status(200)
            .json({ token: token, expiresIn: 3600, userId: user!.ID });
        }
      });
    }
  });
};
