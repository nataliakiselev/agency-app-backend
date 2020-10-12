import fs from "fs";
// import util from "util";

export const getOne = (model) => async (req, res) => {
  try {
    const doc = await model.findOne({ _id: req.params.id }).lean().exec();

    if (!doc) {
      return res.status(404).end();
    }

    res.status(200).json({ data: doc });
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

export const getAll = (model) => async (req, res) => {
  try {
    const docs = await model.find({}).lean().exec();

    res.status(200).json({ data: docs });
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
};
export const getMany = (model) => async (req, res) => {
  try {
    const docs = await model.find({ agent: req.params.id }).exec();
    // console.log(req.params);
    // console.log(req.params.id, "agentId");
    if (!docs || docs.length === 0) {
      return res.status(200).send({ data: [] });
    }
    //     .status(400)
    //     .send({ message: "Could not find profiles for this user" });
    // }
    // console.log(docs);
    res.status(200).json({ data: docs });
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
};
export const createOne = (model) => async (req, res) => {
  // console.log("body", req.body);
  // console.log("Headers", req.headers);

  try {
    req.body.mainImg = req.file.path;
    const doc = await model.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

export const updateOne = (model) => async (req, res) => {
  try {
    const updatedDoc = await model
      .findOneAndUpdate(
        {
          agent: req.user._id,
          _id: req.params.id,
        },
        req.body,
        { new: true },
      )
      .lean()
      .exec();

    // console.log("updatedDoc", updatedDoc);

    // const agentId = model.agent.toString();
    // if (req.userData.userId !== updatedDoc.agent)
    // if (agentId !== req.user.userId) {
    // return res.status(401).send({
    //   message: "You are not allowed to edit this profile.",
    // });
    // }
    if (!updatedDoc) {
      return res.status(404).end();
    }

    res.status(200).json({ data: updatedDoc });
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};

export const removeOne = (model) => async (req, res) => {
  try {
    const removed = await model.findOneAndRemove({
      agent: req.user._id,
      _id: req.params.id,
    });
    const imagePath = removed.mainImg;
    fs.unlink(imagePath, (err) => {
      if (err) return res.status(500).send("Failed to unlink mainImg");
    });

    removed.photos.map((photo) => {
      const photoPath = photo.path;
      // console.log(photoPath, "path");
      fs.unlink(photoPath, (err) => {
        if (err) return res.status(500).send("Failed to unlink photos");
      });
    });

    if (!removed) {
      return res.status(400).end();
    }

    return res.status(204).json({ data: removed });
  } catch (e) {
    console.error(e);
    res.status(400).send(e);
  }
};

export const crudControllers = (model) => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  getAll: getAll(model),
  getOne: getOne(model),
  createOne: createOne(model),
  getMany: getMany(model),
});
