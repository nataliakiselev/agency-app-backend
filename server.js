import express from "express";
import mongoose from "mongoose";
import bodyparser from "body-parser";
import cors from "cors";
import profileRouter from "./routes/profile.router";

require("dotenv").config();
const app = express();
const port = process.env.PORT;

const connect = (url = process.env.DB_URL) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(cors());

app.use("/mern/profiles", profileRouter);
app.get("/mern", (req, res) => {
  res.send(`mern app is running on ${port}`);
});

// app.listen(PORT, () => console.log(`mern is running on port ${PORT}`));

export const start = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`MERN API on http://localhost:${port}`);
    });
  } catch (e) {
    console.error(e);
  }
};
