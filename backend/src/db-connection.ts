import mysql, {
  type ConnectionOptions,
  type Pool,
} from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const conOptions: ConnectionOptions = {
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  port: +process.env.DB_PORT!,
  dateStrings: ["DATE"],
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const con: Pool = mysql.createPool(conOptions);
export default con;
