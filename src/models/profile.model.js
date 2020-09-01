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
      type: Number,

      required: true,
    },

    bust: {
      type: Number,
      required: true,
    },

    waist: {
      type: Number,
      required: true,
    },

    hips: {
      type: Number,
      required: true,
    },

    shoes: {
      type: Number,
      required: true,
    },
    hair: {
      type: String,
      required: true,
    },

    eyes: {
      type: String,
      required: true,
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
    },

    mainImg: {
      type: String,
      required: true,
    },
    photos: [
      {
        path: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

profileSchema.index({ user: 1, name: 1 }, { unique: true });

export const Profile = mongoose.model("Profile", profileSchema);
