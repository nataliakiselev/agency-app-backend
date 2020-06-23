import { User } from "../models/user.model";

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

    res.status(201).json({ user });
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
    const user = await User.findOne({ email: req.body.email })
      // .select("email password") // Why are you sending the PW back here??
      .exec();

    if (!user) {
      return res.status(401).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }

    return res.status(201).send({ user });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};
