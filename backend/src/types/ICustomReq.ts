import type { Request } from "express";
export interface ICustomReq extends Request {
  userId: number;
}
