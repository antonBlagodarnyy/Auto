import mysql, { type Connection, type ConnectionOptions } from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const conOptions: ConnectionOptions = {
  host: process.env.HOST!,
  user: process.env.USER!,
  password: process.env.PASSWORD!,
  database: process.env.DATABASE!,
  port: +process.env.DBPORT!,
  dateStrings: ["DATE"],
};

const con: Connection = mysql.createConnection(conOptions);
export default con;
