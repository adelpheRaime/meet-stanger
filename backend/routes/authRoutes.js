"use strict";
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Token = require("../models/token");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { template } = require("../template");
const nodemailer = require("nodemailer");
const { isVerify } = require("../utils/authenticate");
const { v4: uuid4 } = require("uuid");
const { generateToken } = require("../utils/authenticate");
const {
  isRegisterValidator,
  isLoginValidator,
} = require("../utils/validators");
const { validationResult } = require("express-validator");
const sendgrid = require('@sendgrid/mail')
sendgrid.setApiKey(process.env.SENDGRIDAPIKEY)

router.post("/register", isRegisterValidator, async (req, res) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(500).json(errors);
    return;
  }
  const token = generateToken(user, "1d");
  let createdToken = await Token.findOneAndUpdate(
    { email: req.body.email },
    {
      confirmationToken: token,
      email: req.body.email,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  sendgrid.send({
    from: "youremailime@gmail.com",
    to: req.body.email,
    subject: "Email Confirmation",
    text:"Meet Stranger",
    html: template(createdToken._id),
  })
  .then(()=>{
    res.send(user);
  },error=>{
    res.status(500).json({ success: false, error: error });
  })  
  // let mailTransporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port:465,
  //   secure:true,
  //   auth: {
  //     type: "OAuth2",
  //   },
  // });
  // mailTransporter.sendMail(
  //   {
  //     from: "Meet-Stranger",
  //     to: req.body.email,
  //     subject: "Email Confirmation",
  //     html: template(createdToken._id),
  //     auth: {
  //       user: "youremail"
  //     },
  //   },
});

router.get("/confirmation/:id", async (req, res) => {
  const { id } = req.params;
  
  try {
    const tk = await Token.findOne({ _id: id });
    const token = tk.confirmationToken;

    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        let user = await User.findOneAndUpdate(
          { email: decode.email },
          {
            username: decode.username,
            email: decode.email,
            password: bcrypt.hashSync(decode.password, 8),
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        if (user) {
          const token = generateToken(
            {
              _id: user._id,
              username: user.username,
              profile: user.profile,
            },
            "30d"
          );
          res.cookie("_fXeTk", token);
          res.send({ user, token });
        } else {
          res.status(401).send({ message: "save error" });
        }
      }
    });
  } catch (err) {
    console.log(err);
    res.status(401).send({ message: "saved error" });
  }
});
router.get("/check/:email", async (req, res, next) => {
  const { email } = req.params;
  const user = await User.findOne({ email: email });
  if (user) {
    const token = generateToken(
      {
        _id: user._id,
        username: user.username,
        profile: user.profile,
      },
      "30d"
    );
    res.cookie("_fXeTk", token);
    res.send({ user, token });
    return;
  }
  res.status(500).send({ isValid: false });
});
router.post("/login", isLoginValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(500).json(errors);
    return;
  }
  const user = await User.findOne({ email: req.body.email });

  const token = generateToken(
    {
      _id: user._id,
      username: user.username,
      profile: user.profile,
    },
    "30d"
  );
  res.cookie("_fXeTk", token);
  res.send({ user, token });
});
router.post("/logout", isVerify, async (req, res) => {
  res.clearCookie("_fXeTk");
  res.status(200).send({ success: true });
});
module.exports = router;
