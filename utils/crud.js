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
    const docs = await model.find({ agent: req.params.uid }).exec(); //{ agent: req.params._id }
    console.log(req.params.uid, "agentId");
    if (!docs || docs.length === 0) {
      return res
        .status(400)
        .send({ message: "Could not find profiles for this user" });
    }
    res.status(200).json({ data: docs });
    // res.status(200).json({ data: docs.map((doc) => doc.toObject()) });
  } catch (err) {
    console.error(err);
    res.status(400).end();
  }
};
export const createOne = (model) => async (req, res) => {
  // const agent = req.user._id;

  console.log("body", req.body);
  console.log("Headers", req.headers);

  try {
    req.body.mainImg = req.file.path;
    const doc = await model.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};
//  model.photos = [...model.photos, ...req.files.map(file => {
//     return {
//       path: file.path,
//       name: file.originalname
//     };

export const updateOne = (model) => async (req, res) => {
  try {
    const updatedDoc = await model
      .findOneAndUpdate(
        {
          _id: req.params.id,
        },
        req.body,
        { new: true },
      )
      .lean()
      .exec();

    if (!updatedDoc) {
      return res.status(400).end();
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
      _id: req.params.id,
    });

    if (!removed) {
      return res.status(400).end();
    }

    return res.status(200).json({ data: removed });
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
