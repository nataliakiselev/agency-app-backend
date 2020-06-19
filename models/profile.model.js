import mongoose from "mongoose";

const Schema = mongoose.Schema;
const profileSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        required: true,
      },
      last: {
        type: String,
        required: true,
      },
    },
    height: {
      type: String,

      required: true,
    },

    bust: {
      type: String,
      required: true,
    },

    waist: {
      type: String,
      required: true,
    },

    hips: {
      type: String,
      required: true,
    },

    shoes: {
      type: String,
      required: true,
    },
    hair: {
      type: String,
      // required: true,
    },

    eyes: {
      type: String,
      // required: true,
    },

    email: {
      type: String,
      unique: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
    },

    // list: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: "list",
    //   required: true,
    // },
    agent: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      // required: true,
    },

    avatar: {
      type: String,
      // required: true,
    },
    // photos: [
    //   {
    //     path: {
    //       type: String,
    //       required: true,
    //     },
    //     name: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // ],
  },
  { timestamps: true },
);

profileSchema.index({ user: 1, name: 1 }, { unique: true });

export const Profile = mongoose.model("Profile", profileSchema);
