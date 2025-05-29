const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" }, 
  content: String,
  timestamp: { type: Date, default: Date.now },
  seen: { type: Boolean, default: false },
  type: { type: String, enum: ["private", "group"], default: "private" },
});

module.exports = mongoose.model("Message", messageSchema);
