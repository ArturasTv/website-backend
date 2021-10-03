require("dotenv").config();

const cron = require("node-cron");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const updateDatabase = require("./cron/updateDatabase");
const cors = require("cors");

const corsOptions = {
  origin: process.env.REACT_APP_BASE_URL,
};

app.use(cors(corsOptions));

app.use(express.static("public"));

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to database"));
app.use(express.json());

const repositoriesRouter = require("./routes/repository/repository-routes");
app.use("/api", repositoriesRouter);

const uploadProject = require("./routes/project/project-routes");
app.use("/api", uploadProject);

const authRouter = require("./routes/auth/auth-routes");
app.use("/api", authRouter);

const userRouter = require("./routes/user/user-routes");
app.use("/api", userRouter);

cron.schedule("*/15 * * * *", () => {
  console.log("Database Updated"); //Cron job to update database every 15 minutes
  updateDatabase();
});

app.listen(process.env.PORT || 3000, () => console.log("Server started"));
