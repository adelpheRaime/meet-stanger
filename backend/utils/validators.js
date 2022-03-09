"use strict";
const { check } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.isRegisterValidator = [
  check("username")
    .isString()
    .withMessage("Username must be letter")
    .custom(async (username) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error("Username already in use");
      }
    })
    .trim(),
  check("password").isString().trim(),
  check("email")
    .isEmail()
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already in use");
      }
    })
    .trim(),
];
exports.isLoginValidator = [
  check("email").custom(async (email) => {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new Error("Email not found");
    }
  }),
  check("password").custom(async (password, { req }) => {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      if (!bcrypt.compareSync(password, existingUser.password)) {
        throw new Error("Invalid password");
      }
    }
  }),
];
