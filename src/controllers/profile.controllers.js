import { crudControllers } from "../utils/crud";
import { Profile } from "../models/profile.model";
import fs from "fs";
import AWS from "aws-sdk";
// import util from "util";

const { AWS_ID, AWS_KEY, BUCKET_NAME, AWS_ENABLED } = process.env;

AWS.config.update({
  accessKeyId: AWS_ID,
  secretAccessKey: AWS_KEY,
  region: "eu-west-2",
});

const s3 = new AWS.S3({
  params: {
    Bucket: BUCKET_NAME,
  },
});

export const addPhotos = (req, res) => {
  Profile.find({
    _id: req.params.id,
    agent: req.user._id,
  }).exec((err, result) => {
    if (err) return res.status(400).end();
    if (!result.length) return res.sendStatus(404);
    const profile = result[0];
    console.log(req.files, "req.file");

    profile.photos = [
      ...profile.photos,
      ...req.files.map((file) => {
        return {
          path: file.path || file.location,
          name: file.filename || file.key,
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
  Profile.find({ _id: req.params.id, agent: req.user._id }).exec(
    (err, result) => {
      if (err) return res.status(400).end();
      if (!result.length) return res.sendStatus(404);
      const profile = result[0];
      const oldPhoto = profile.mainImg;
      if (AWS_ENABLED) {
        s3.deleteObject({ Key: oldPhoto.name }, function (err, data) {
          if (err) return res.status(500).send("Failed to delete photo");
          // else console.log("removed Key", oldPhoto.name);
        });
      } else {
        fs.unlink(oldPhoto, (err) => {
          if (err) return res.status(500).send("Failed to unlink photo");
          // else console.log("photo removed");
        });
      }

      profile.mainImg = req.file.path || req.file.location;
      console.log(profile.mainImg);
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
      console.log(req.params, "req.params");
      if (err) return res.status(400).end();
      if (!result) return res.sendStatus(404);
      const profile = result[0];
      const removedId = req.params.photo_id;
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

      if (AWS_ENABLED) {
        s3.deleteObject({ Key: removed.name }, function (err, data) {
          if (err) return res.status(500).send("Failed to delete photo");
          // else console.log("removed Key", removed.name);
        });
      } else {
        fs.unlink(removed.path, (err) => {
          if (err) return res.status(500).send("Failed to unlink photo");
          // console.log("photo removed");
        });
      }
      profile.photos.pull(removed);
      profile.save((err, result) => {
        if (err) return res.status(500).send("failed to save");
        if (!result) return res.sendStatus(404);
        res.sendStatus(204);
      });
    },
  );
};
export default crudControllers(Profile);
