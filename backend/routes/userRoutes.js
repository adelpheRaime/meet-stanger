"use strict";
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { data } = require("../data");
const { isVerify, getUserId } = require("../utils/authenticate");
router.get("/seed", async (req, res, next) => {
  await User.insertMany(data.users, (err, data) => {
    res.send(data);
  });
});
router.get("/test", async (req, res, next) => {
  const userList = await User.find().limit(5);
  res.json(userList);
});

router.get("/me", isVerify, async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findOne({ _id: _id });
  res.send(user);
});
router.get("/profile/:username", async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username: username });
  res.send(user);
});

router.patch("/profile/edit", isVerify, async (req, res, next) => {
  const { about, userStatus, profile, coverPhoto } = req.body;
  const { _id } = req.user;
  await User.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      about: about,
      userStatus: userStatus,
      profile: profile,
      coverPhoto: coverPhoto,
    },
    { new: true },
    (err, data) => {
      res.send(data);
    }
  );
});

router.get("/", getUserId, async (req, res, next) => {
  const id = req._id;
  const parmasId = id !== "" ? { _id: { $not: { $in: [id] } } } : {};
  const userList = await User.find(parmasId).limit(5);
  console.log(userList)
  res.json(userList);
});

router.post("/filter", getUserId, async (req, res, next) => {
  const id = req._id;
  const { ref } = req.body;
  const parmasId = id !== "" ? { _id: { $not: { $in: [id] } } } : {};
  try {
    const foundUser = await User.find({
      username: {
        $regex: ref,
        $options: "$i",
      },
      ...parmasId,
    }).limit(5);
    res.send(foundUser);
  } catch (err) {
    res.status(500).json({ error: "user is not found" });
  }
});

module.exports = router;
