import { crudControllers } from "../utils/crud";
import { Profile } from "../models/profile.model";
import fs from "fs";
// import util from "util";

export const addPhotos = (req, res) => {
  Profile.find({
    _id: req.params.id,
    agent: req.user._id,
  }).exec((err, result) => {
    if (err) return res.status(400).end();
    if (!result.length) return res.sendStatus(404);
    const profile = result[0];

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
      return res.status(200).json({ data: profile });
    });
  });
};

export const updateCover = (req, res) => {
  // console.log(req.params.id, "profile.id");

  Profile.find({ _id: req.params.id, agent: req.user._id }).exec(
    (err, result) => {
      if (err) return res.status(400).end();
      if (!result.length) return res.sendStatus(404);
      // console.log(result, "result");
      const profile = result[0];
      // console.log(profile._id);
      const oldPhoto = profile.mainImg;
      // console.log(oldPhoto);
      fs.unlink(oldPhoto, (err) => {
        console.log(err);
      });
      profile.mainImg = req.file.path;
      // console.log(profile.mainImg);
      profile.save((err, profile) => {
        if (err) return res.status(400).end();
        if (!profile) return res.sendStatus(404);
        res.sendStatus(200);
      });
    },
  );
};

export const deletePhoto = (req, res) => {
  Profile.find({ _id: req.params.id, agent: req.user._id }).exec(
    (err, result) => {
      // console.log(req.params);
      if (err) return res.status(400).end();
      if (!result) return res.sendStatus(404);
      const profile = result[0];
      const removedId = req.params.photo_id;
      // console.log(removedId, "removedId");

      const removed = profile.photos.find((photo) => {
        // console.log(photo._id, removedId, photo._id.toString() === removedId);
        //NB:typeof
        // console.log(
        //   util.inspect(photo._id, {
        //     depth: 10,
        //     colors: true,
        //     showHidden: true,
        //   }),
        // );
        // console.log(
        //   typeof photo._id,
        //   photo._id.toString(),
        //   typeof removedId,
        //   removedId,
        //   photo._id.toString() === removedId,
        // );
        return photo._id.toString() === removedId;
      });
      console.log(removed, "removed");
      const deletedPath = removed.path;
      // console.log(deletedPath, "path");

      fs.unlink(deletedPath, (err) => {
        if (err) return res.status(500).send("Failed to unlink photo");
        profile.photos.pull(removed);
        profile.save((err, result) => {
          if (err) return res.status(500).send("failed to save");
          if (!result) return res.sendStatus(404);
          res.sendStatus(204);
        });
      });
    },
  );
};
export default crudControllers(Profile);