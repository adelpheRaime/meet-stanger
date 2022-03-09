"use strict";
const express = require("express");
const router = express.Router();
const Inbox = require("../models/inbox");
const { data } = require("../data");
const { isVerify } = require("../utils/authenticate");
//seed user
router.get("/seed", async (req, res, next) => {
  // await User.remove({});
  const inboxs = await Inbox.insertMany(data.inboxs, (err) => {
    next(err);
  });
  res.send({ inboxs });
});
//add inbox for each converasation
router.post("/add", isVerify, async (req, res, next) => {
  const { _id } = req.user;
  const { content, receivedBy } = req.body;
  const operators = [
    {
      sentBy: _id,
      receivedBy: receivedBy,
    },
    {
      sentBy: receivedBy,
      receivedBy: _id,
    },
  ];
  const fields = {
    content: content,
    sentBy: _id,
    receivedBy: req.body.receivedBy,
  };
  await Inbox.findOneAndUpdate(
    {
      $or: operators,
    },
    { ...fields, view: [], delete: [] },
    {
      upsert: true,
      new: true,
      useFindAndModify: false,
      setDefaultsOnInsert: true,
      populate: [{ path: "user" }, { path: "receiver" }],
    },
    (err, data) => {
      res.send(data);
    }
  );
});
//edit inbox as the conversation is viewed
router.patch("/edit", isVerify, async (req, res, next) => {
  const { _id } = req.body;
  const user = req.user;

  try {
    await Inbox.findOneAndUpdate(
      {
        _id: _id,
      },
      { $addToSet: { view: user._id } },
      {
        useFindAndModify: false,
        new: true,
        populate: { path: "user" },
      },
      (err, data) => {
        console.log(data);
        res.send(data);
      }
    );
  } catch (err) {
    res.status(500).json({ error: "not found" });
  }
});
//delete inbox
router.delete("/delete", isVerify, async (req, res, next) => {
  const { _id } = req.body;
  const user = req.user;
  try {
    const payload = await Inbox.findOneAndUpdate(
      { _id: _id },
      {
        $addToSet: { delete: user._id },
      },
      {
        useFindAndModify: false,
      }
    );
   
    res.send({ success: true, payload });
  } catch (err) {
    res.status(500).json({ error: "not found" });
  }
});

//get list of inbox of all conversations
router.get("/list", isVerify, async (req, res, next) => {
  const { _id } = req.user;
  try {
    const query = await Inbox.find({
      receivedBy: _id,
      delete: { $ne: [_id] },
    })
      .populate(["user", "receiver"])
      .sort({ createdAt: "desc" });

    res.status(200).json(query);
  } catch (err) {
    res.status(500).json({
      success: false,
      massage: "Not Found",
    });
  }
});

module.exports = router;
