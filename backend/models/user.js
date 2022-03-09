"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
  },
});

const UserSchema = new Schema(
  {
    email: {
      type: String,
    },
    username: {
      type: String,
    },
    password: String,
    about: {
      type: String,
      default: "have not description",
    },
    userStatus: {
      type: String,
      default: "friend",
    },
    profile: {
      type: String,
      default: "noAvatar.png",
    },
    coverPhoto: {
      type: String,
      default:
        "https://res.cloudinary.com/dcve8ebof/image/upload/v1643354838/cld-sample.jpg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
