"use strict";
const bcrypt = require("bcryptjs");
exports.data = {
  users: [
    {
      username: "Fred",
      email: "fred@gmail.com",
      password: bcrypt.hashSync("123", 8),
      profile:
        "https://res.cloudinary.com/dcve8ebof/image/upload/v1645091556/images/f18_aetxin.jpg",
    },
    {
      username: "Diana",
      email: "diana@gmail.com",
      password: bcrypt.hashSync("123", 8),
      profile:
        "https://res.cloudinary.com/dcve8ebof/image/upload/v1645091525/images/f11_cjysmz.jpg",
    },
    {
      username: "Anna",
      email: "anna@gmail.com",
      password: bcrypt.hashSync("123", 8),
      profile:
        "https://res.cloudinary.com/dcve8ebof/image/upload/v1645091477/images/f15_cwb2nr.jpg",
    },
    {
      username: "Lea",
      email: "lea@gmail.com",
      password: bcrypt.hashSync("123", 8),
      profile:
        "https://res.cloudinary.com/dcve8ebof/image/upload/v1645091434/images/collection_19_tayc6e.jpg",
    },
    {
      username: "Henry",
      email: "henry@gmail.com",
      password: bcrypt.hashSync("123", 8),
      profile:
        "https://res.cloudinary.com/dcve8ebof/image/upload/v1645091418/images/collection_18_ao9oxr.jpg",
    },
  ],
};
