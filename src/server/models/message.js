const mongoose = require("mongoose");
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  time: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
