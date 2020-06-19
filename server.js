import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bodyparser from "body-parser";
import cors from "cors";
// import { signup } from "./utils/auth";
import userRouter from "./routes/user.router";
import profileRouter from "./routes/profile.router";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

const connect = (url = process.env.DB_URL) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use("/api/profiles", profileRouter);
app.use("/api/users", userRouter);
app.get("/api", (req, res) => {
  res.send(`mern app is running on ${port}`);
});

//handle unsupported routes
app.use((req, res, next) => {
  res.status(404).send({ message: "Could not find the route" });
});
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});
export const start = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`MERN API on http://localhost:${port}/api`);
    });
  } catch (e) {
    console.error(e);
  }
};
