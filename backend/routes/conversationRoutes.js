"use strict";
const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversation");
const { data } = require("../data");
const { isVerify } = require("../utils/authenticate");
router.get("/seed", async (req, res, next) => {
  // await User.remove({});
  const userConversation = await Conversation.insertMany(
    data.conversations,
    (err) => {
      next(err);
    }
  );
  res.send({ userConversation });
});

router.post("/add", isVerify, async (req, res, next) => {
  const { content, receivedBy } = req.body;
  const { _id } = req.user;
  const fields = {
    content: content,
    sentBy: _id,
    receivedBy: req.body.receivedBy,
  };

  const field1 = new Conversation({ ...fields, owner: receivedBy });
  const field2 = new Conversation({ ...fields, owner: _id });
  await field1.save();
  const createdConversation = await field2.save();
  const conversation = await Conversation.findOne({
    _id: createdConversation._id,
  }).populate("user");
  if (conversation) {
    console.log(conversation)
    res.status(200).json(conversation);
    return;
  }
  res.status(401).send({ message: "can't send the message" });
});

router.get("/:receivedBy", isVerify, async (req, res, next) => {
  const { receivedBy } = req.params;

  const { _id } = req.user;
  const operators = [
    {
      sentBy: receivedBy,
      receivedBy: _id,
    },
    {
      sentBy: _id,
      receivedBy: receivedBy,
    },
  ];
  try {
    const conversations = await Conversation.find({
      $or: operators,
      owner: _id,
    }).populate("user");
    console.log(conversations);
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Not Found",
    });
  }
});
router.delete("/delete", isVerify, async (req, res, next) => {
  const { receivedBy } = req.body;
  const { _id } = req.user;
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
  try {
    await Conversation.deleteMany({
      $or: operators,
      owner: _id,
    });
    console.log("conversation","delete")
    res.status(200).json({
      success: true,
      message: "conversations removed",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Not Found",
    });
  }
});

module.exports = router;
