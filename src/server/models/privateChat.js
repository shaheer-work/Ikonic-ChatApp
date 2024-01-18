const mongoose = require("mongoose");
const privateSchema = new mongoose.Schema({
  sender: { type: String, ref: "User" },
  receiver: { type: String, ref: "User" },
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  time: { type: Date, default: Date.now },
});
const Private = mongoose.model("Private", privateSchema);
module.exports = Private;
