import { Router } from "express";
import controllers from "../controllers/profile.controllers";
import upload from "./../upload";

const router = Router();

// /api/profiles
router.get("/", controllers.getAll);
//   // .post(upload.array("photos", 10), controllers.createOne);
//   .post(controllers.createOne);
// //upload.single("avatar"),
router.get("/:id", controllers.getOne);
// router.use(protect)
router.get("/user/:uid", controllers.getMany);

router.post(
  "/",
  upload.single("avatar"),
  (req, res, next) => {
    const { firstName: first, lastName: last } = req.body;
    req.body.name = {
      first,
      last,
    };
    next();
  },
  controllers.createOne
);

// /api/profiles/:id
router.route("/:id").put(controllers.updateOne).delete(controllers.removeOne);

export default router;
