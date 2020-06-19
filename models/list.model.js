import mongoose from "mongoose";

const Schema = mongoose.Schema;

const listSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

listSchema.index({ user: 1, name: 1 }, { unique: true });
