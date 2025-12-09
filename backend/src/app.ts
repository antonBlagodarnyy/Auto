import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
dotenv.config();

import userRoutes from "./routes/users.js";
import taskRoutes from "./routes/tasks.js";
import storeRoutes from "./routes/store.js";
import clientRoutes from "./routes/clients.js";
import meetingRoutes from "./routes/meetings.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(
  cors({
    origin: [process.env.DEV_URL ?? process.env.CLIENT_URL! ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/users", userRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/meeting", meetingRoutes);

const server = http.createServer(app);

server.listen(+process.env.APP_LOCAL_PORT!, process.env.PROD_ID ?? 'localhost');
