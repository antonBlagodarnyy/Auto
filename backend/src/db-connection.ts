import mysql, { type Connection, type ConnectionOptions } from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const conOptions: ConnectionOptions = {
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: +process.env.DB_PORT!,
  dateStrings: ["DATE"],
};

const con: Connection = mysql.createConnection(conOptions);
export default con;
