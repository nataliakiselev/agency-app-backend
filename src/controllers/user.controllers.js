import { User } from "../models/user.model";
import { getAll } from "../utils/crud";

export const getAllUsers = getAll(User);

export const getUser = (req, res) => {
  res.status(200).json({ data: req.user });
};

// export const updateUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.user._id, req.body, {
//       new: true,
//     })
//       .lean()
//       .exec();
//     res.status(200).json({ data: user });
//   } catch (e) {
//     console.error(e);
//     res.status(400).end();
//   }
// };
