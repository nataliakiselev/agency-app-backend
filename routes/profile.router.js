import { Router } from "express";
import controllers from "../controllers/profile.controllers";
import upload from "./../upload";
import { addPhotos } from "../controllers/profile.controllers";
const router = Router();

// /api/profiles
router.get("/", controllers.getAll);

router.get("/:id", controllers.getOne);
// router.use(protect)
router.get("/user/:uid", controllers.getMany);

router.post(
  "/",
  upload.single("mainImg"),
  // (req, res, next) => {
  //   const { firstName: first, lastName: last } = req.body;
  //   req.body.name = {
  //     first,
  //     last,
  //   };
  //   next();
  // },
  controllers.createOne,
);

// /api/profiles/:id
router.route("/:id").put(controllers.updateOne).delete(controllers.removeOne);
router.post("/:id/upload", upload.array("photos", 10), addPhotos);

export default router;
