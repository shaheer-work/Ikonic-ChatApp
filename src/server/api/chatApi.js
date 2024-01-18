const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Chat = require("../models/chat");
const Community = require("../models/community");
router.post("/addCommunity", async (req, res) => {
  const { communityName } = req.body;
  try {
    const existingCommunity = await Community.findOne({ name: communityName });
    if (existingCommunity) {
      res
        .status(200)
        .json({ success: false, message: "Community already exists." });
    } else {
      const newCommunity = await Community.create({
        name: communityName,
        chats: [],
      });
      res.status(200).json({
        success: true,
        message: "Community added successfully.",
        community: newCommunity,
      });
    }
  } catch (error) {
    console.error("Error adding community:", error);
    res
      .status(500)
      .json({ success: false, message: "Error adding community." });
  }
});
router.post("/addUserToCommunity", async (req, res) => {
  const { userName, communityName } = req.body;
  try {
    const user = await User.findOne({ name: userName });
    const community = await Community.findOne({ name: communityName });
    if (!user || !community) {
      res
        .status(400)
        .json({ success: false, message: "User or community not found." });
    } else {
      user.communities.push(community._id);
      await user.save();
      res.status(200).json({
        success: true,
        message: "User added to the community successfully.",
      });
    }
  } catch (error) {
    console.error("Error adding user to community:", error);
    res
      .status(500)
      .json({ success: false, message: "Error adding user to community." });
  }
});
router.post("/removeUserFromCommunity", async (req, res) => {
  const { userName, communityName } = req.body;
  try {
    const user = await User.findOne({ name: userName });
    const community = await Community.findOne({ name: communityName });
    if (!user || !community) {
      res
        .status(400)
        .json({ success: false, message: "User or community not found." });
    } else {
      user.communities.pull(community._id);
      await user.save();
      res.status(200).json({
        success: true,
        message: "User removed from the community successfully.",
      });
    }
  } catch (error) {
    console.error("Error removing user from community:", error);
    res
      .status(500)
      .json({ success: false, message: "Error removing user from community." });
  }
});
router.post("/sendMessage", async (req, res) => {
  const { chatId, messageContent, senderName } = req.body;
  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(400).json({ success: false, message: "Chat not found." });
    } else {
      const sender = await User.findOne({ name: senderName });
      if (!sender) {
        res.status(400).json({ success: false, message: "Sender not found." });
      } else {
        const newMessage = await Message.create({
          sender: sender._id,
          content: messageContent,
        });
        chat.messages.push(newMessage._id);
        await chat.save();
        res
          .status(200)
          .json({ success: true, message: "Message sent successfully." });
      }
    }
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Error sending message." });
  }
});

module.exports = router;
