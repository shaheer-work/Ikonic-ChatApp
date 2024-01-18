const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  socketId: { type: String },
  chats: [{
    type: mongoose.Schema.Types.ObjectId, ref: "Chat"
  }],
  communities: [{
    type: mongoose.Schema.Types.ObjectId, ref: "Community"
  }],
});
const User = mongoose.model("User", userSchema);
module.exports = User;
