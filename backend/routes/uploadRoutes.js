"use strict";
const multer = require("multer");
const express = require("express");
const { isVerify } = require("../utils/authenticate");
const uploadRouter = express.Router();
const cloudinary = require("cloudinary");
const fs = require("fs");
if (!fs.existsSync("./images")) {
  fs.mkdirSync("./images");
}
const timestamp = Math.round(new Date().getTime() / 1000);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
//your cloudinary api config
cloudinary.config({
  cloud_name: "",
  api_key: "",
  api_secret: "",
});

uploadRouter.post("/", isVerify, upload.single("file"), async (req, res) => {
  await cloudinary.v2.uploader
    .upload(req.file.path, { timestamp: timestamp })
    .then((result) => {
      console.log(result.url);
      fs.unlinkSync(req.file.path);
      res.send({
        success: true,
        path: result.url,
      });
    })
    .catch((err) => {
      console.log(err);
      fs.unlinkSync(req.file.path);
      res.send({ success: false, error: err });
    });
});

module.exports = uploadRouter;
