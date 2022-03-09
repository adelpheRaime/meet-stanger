"use strict";
const jwt = require("jsonwebtoken");

exports.generateToken = (user, expire) => {
  return jwt.sign({ ...user }, process.env.JWT_SECRET, {
    expiresIn: expire,
  });
};

exports.isVerify = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ code: "TkerrorNotBscad" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ code: "TkerrorNotBscad" });
  }
};
exports.getUserId = (req, res, next) => {
  const token = req.cookies._fXeTk;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        req._id = "";
        next();
      } else {
        req._id = decode._id;
        next();
      }
    });
  } else {
    req._id = "";
    next();
  }
};
