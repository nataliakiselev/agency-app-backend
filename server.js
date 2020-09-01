import express from "express";
import mongoose from "mongoose";
import bodyparser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import fs from "fs";
import userRouter from "./routes/user.router";
import profileRouter from "./routes/profile.router";

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const { PORT = 4000 } = process.env;
const { DB_USER, DB_PW, DB_NAME } = process.env;
const MONGODB_URI = `mongodb+srv://${DB_USER}:${DB_PW}@cluster0-sxep5.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const connect = (url = MONGODB_URI) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

mongoose.set("useCreateIndex", true);

app.use("/uploads", express.static("uploads"));

app.use("/api/profiles", profileRouter);

app.use("/api/users", userRouter);

//handle unsupported routes
app.use((req, res, next) => {
  res.status(404).send({ message: "Could not find the route" });
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => console.log(err));
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

export const start = async () => {
  try {
    await connect();
    app.listen(PORT || 4000, () => {
      console.log(`MERN API on http://localhost:${PORT}/api`);
    });
  } catch (e) {
    console.error(e);
  }
};
