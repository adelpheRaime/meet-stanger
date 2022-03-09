"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InboxSchema = new Schema(
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
    view: Array,
    delete: Array,
    sentBy: Schema.Types.ObjectId,
    receivedBy: Schema.Types.ObjectId,
    static: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

InboxSchema.virtual("user", {
  ref: "User",
  localField: "sentBy",
  foreignField: "_id",
  justOne: true,
});
InboxSchema.virtual("receiver", {
  ref: "User",
  localField: "receivedBy",
  foreignField: "_id",
  justOne: true,
});
InboxSchema.set("toObject", { virtuals: true });
InboxSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.models.Inbox || mongoose.model("Inbox", InboxSchema);
