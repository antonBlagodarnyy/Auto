import jwt from "jsonwebtoken";
export interface ICustomJWT extends jwt.JwtPayload {
  userId: number;
}
