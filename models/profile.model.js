import mongoose from "mongoose";

var _ = require("lodash");

const profileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },

    gender: String,
    location: {
      city: String,
      country: String,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: Number,
  },
  { timestamps: true },
);

profileSchema
  .virtual("name.full")
  .get(function () {
    return _.startCase(this.name.first + " " + this.name.last);
  })
  .set(function (value) {
    this.name.first = value.substr(0, v.indexOf(" "));
    this.name.last = value.substr(v.indexOf(" ") + 1);
  });

export const Profile = mongoose.model("Profile", profileSchema);
