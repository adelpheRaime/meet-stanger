"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationSchema = new Schema(
  {
    content: {
      type: Object,
      default: {
        type: "",
        body: "",
        filename: "",
        mimeType: "",
      },
    },
    sentBy: Schema.Types.ObjectId,
    receivedBy: Schema.Types.ObjectId,
    owner: Schema.Types.ObjectId,
    static: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ConversationSchema.virtual("user", {
  ref: "User",
  localField: "sentBy",
  foreignField: "_id",
  justOne: true,
});
ConversationSchema.virtual("inbox", {
  ref: "Inbox",
  localField: "_id",
  foreignField: "_id",
  justOne: true,
});
ConversationSchema.set("toObject", { virtuals: true });
ConversationSchema.set("toJSON", { virtuals: true });
module.exports =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", ConversationSchema);
