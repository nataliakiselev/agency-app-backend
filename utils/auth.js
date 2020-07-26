import dotenv from "dotenv";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";

dotenv.config();

export const newToken = (user) =>
  jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

export const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
      console.log(payload, "payload");
    });
  });

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    console.log(req.body);
    return res.status(400).send({ message: "Valid email and password needed" });
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email: req.body.email });
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Signing up failed, please try again later" });
  }
  if (existingUser) {
    return res.status(422).send({ message: "Email already in use" });
  }
  try {
    const user = await User.create(req.body);
    const token = newToken(user);
    res.status(201).json({ token }); //userId: user.id, email: user.email,
  } catch (err) {
    return res.status(500).end();
  }
};

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "valid email and password needed" });
  }

  const invalid = { message: "Invalid email and password combination" };

  try {
    console.log(req.body);
    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
      return res.status(401).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }
    const token = newToken(user);
    return res.status(201).send({
      userId: user.id,
      token: token,
    }); //userId: user.id, email: user.email,
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

export const protect = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  const bearer = req.headers.authorization;
  if (!bearer || !bearer.startsWith("Bearer")) {
    return res.status(401).end();
  }
  const token = bearer.split("Bearer ")[1].trim();
  let payload;
  try {
    console.log("verifying");
    payload = await verifyToken(token);
    console.log(payload.userId, "payload.id");
  } catch (e) {
    return res.status(401).end();
  }

  // const user = await User.findById(payload.userId)
  //   .select("-password")
  //   .lean()
  //   .exec();
  // console.log(user);
  // if (!user) {
  //   return res.status(401).end();
  // }
  // req.user = user;
  req.userData = { userId: payload.userId };
  console.log("req.user", req.userData);

  next();
};
