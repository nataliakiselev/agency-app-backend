import { crudControllers } from "../utils/crud";
import { Profile } from "../models/profile.model";

export const addPhotos = (req, res) => {
  Profile.find({
    _id: req.params.id,
  }).exec((err, result) => {
    if (err) return res.status(400).end();
    if (!result.length) return res.sendStatus(404);
    const profile = result[0];
    console.log(profile._id);
    console.log(req.params.id, "id");

    // console.log('photos', profile.photos)
    console.log("files", req.files);

    // const files = Object.values(req.files);
    // console.log(files);
    profile.photos = [
      ...profile.photos,
      ...req.files.map((file) => {
        return {
          path: file.path,
          name: file.filename,
        };
      }),
    ];
    profile.save((err, profile) => {
      if (err) return res.status(400).end();
      if (!profile) return res.sendStatus(404);
    });
  });
};

export default crudControllers(Profile);
