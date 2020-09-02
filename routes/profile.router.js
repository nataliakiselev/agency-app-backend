import { Router } from "express";
import controllers, { deletePhoto } from "../controllers/profile.controllers";
import upload from "../../upload";
import { addPhotos, updateCover } from "../controllers/profile.controllers";
import { protect } from "../utils/auth";
const router = Router();

// /api/profiles
router.get("/", controllers.getAll);

router.get("/:id", controllers.getOne);
router.get("/user/:id", controllers.getMany);

router.use(protect);
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

router
  .route("/:id")
  .put(controllers.updateOne)
  .delete(controllers.removeOne)
  .post(upload.array("photos", 10), addPhotos);
router.put("/:id/updatecover", upload.single("mainImg"), updateCover);
router.delete("/:id/photo/:photo_id", deletePhoto);

export default router;
