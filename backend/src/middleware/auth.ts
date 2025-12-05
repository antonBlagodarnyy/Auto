import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import type { ICustomJWT } from "../types/ICustomJWT.js";
import type { ICustomReq } from "../types/ICustomReq.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY!);
    (req as ICustomReq).userId = (decoded as ICustomJWT).userId;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};
