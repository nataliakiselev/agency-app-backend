import { crudControllers } from "../utils/crud";
import { Profile } from "../models/profile.model";
import fs from "fs";

export const addPhotos = (req, res) => {
  Profile.find({
    _id: req.params.id,
  }).exec((err, result) => {
    if (err) return res.status(400).end();
    if (!result.length) return res.sendStatus(404);
    const profile = result[0];
    if (profile.agent.toString() !== req.userData.userId) {
      return res.status(401).send({
        message: "You are not allowed to edit this profile.",
      });
    }
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
  console.log(req.params.id, "profile.id");

  Profile.find({ _id: req.params.id }).exec((err, result) => {
    if (err) return res.status(400).end();
    if (!result.length) return res.sendStatus(404);
    console.log(result, "result");
    const profile = result[0];

    if (profile.agent.toString() !== req.userData.userId) {
      return res.status(401).send({
        message: "You are not allowed to edit this profile.",
      });
    }
    console.log(profile._id);
    const oldPhoto = profile.mainImg;
    console.log(oldPhoto);
    fs.unlink(oldPhoto, (err) => {
      console.log(err);
    });
    profile.mainImg = req.file.path;
    console.log(profile.mainImg);
    profile.save((err, profile) => {
      if (err) return res.status(400).end();
      if (!profile) return res.sendStatus(404);
      res.sendStatus(200);
    });
  });
};

export const deletePhoto = (req, res) => {
  Profile.findById(req.params.id).exec((err, result) => {
    console.log(req.params);
    if (err) return res.status(400).end();
    if (!result) return res.sendStatus(404);
    console.log(result.agent, "agent");
    // Add ownership check after adding Authentication
    if (result.agent.toString() !== req.userData.userId) {
      return res.status(401).send({
        message: "You are not allowed to edit this profile.",
      });
    }

    const removedId = req.params.photo_id;
    // console.log(removedId, "removedId");

    const removed = result.photos.find((photo) => {
      // console.log(photo._id, removedId, photo._id.toString() === removedId);    //NB:typeof
      return photo._id.toString() === removedId;
    });
    console.log(removed, "removed");
    const deletedPath = removed.path;
    console.log(deletedPath, "path");

    fs.unlink(deletedPath, (err) => {
      if (err) return res.status(500).send("Failed to unlink photo");
      result.photos.pull(removed);
      result.save((err, result) => {
        if (err) return res.status(500).send("failed to save");
        if (!result) return res.sendStatus(404);
        res.sendStatus(204);
      });
    });
  });
};
export default crudControllers(Profile);
