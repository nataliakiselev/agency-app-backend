import { Router } from "express";
import { signup, signin } from "../utils/auth";
import {
  getAllUsers,
  // getUser,
  // updateUser,
} from "../controllers/user.controllers";

const router = Router();

router.get("/", getAllUsers);
router.post("/signup", signup);
router.post("/login", signin);

// router.route("/:id").get(getUser).put(updateUser);

export default router;
