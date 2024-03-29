const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema({
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
