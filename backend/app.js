const express = require("express");
require("dotenv").config();
const cors = require("cors");

const userRoutes = require("./routes/user");
const taskRoutes = require("./routes/task");
const storeRoutes = require("./routes/store");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/task", taskRoutes);
app.use("api/store", storeRoutes);

module.exports = app;
