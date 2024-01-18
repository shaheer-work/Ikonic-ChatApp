const io = require("./index.js").io;
const {
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT,
  COMMUNITY_CHAT,
  MESSAGE_RECIEVED,
  MESSAGE_SENT,
  TYPING,
  PRIVATE_MESSAGE,
  JOIN_COMMUNITY,
  JOIN_COMMUNITY_SUCCESS,
  JOIN_COMMUNITY_FAILURE,
  LEAVE_COMMUNITY,
  REMOVE_FROM_COMMUNITY,
} = require("../Events");
const connectDB = require("./db");
const User = require("./models/user");
const Chat = require("./models/chat");
const Community = require("./models/community");
const Message = require("./models/message");
const Private = require("./models/privateChat.js");
connectDB();
let connectedUsers = {};
let communityChat = null;
module.exports = function (socket) {
  console.log("Socket Id:" + socket.id);
  socket.on(VERIFY_USER, async (data) => {
    try {
      console.log("Received data:", data);
      const { name: nickname } = data;
      const existingUser = await User.findOne({ name: nickname });
      if (existingUser) {
        socket.emit(VERIFY_USER, { isUser: true, user: null });
      } else {
        const newUser = { name: nickname, socketId: socket.id };
        const savedUser = await new User(newUser).save();
        socket.emit(VERIFY_USER, { isUser: true, user: savedUser });
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      socket.emit(VERIFY_USER, { isUser: false, user: null });
    }
  });

  socket.on(USER_CONNECTED, async (user) => {
    try {
      const existingUser = await User.findOne({ name: user.name });
      if (existingUser) {
        existingUser["socketId"] = socket.id;
        connectedUsers = addUser(connectedUsers, existingUser);
        console.log("connected users here: ", connectedUsers);
        socket.user = existingUser;
        sendTypingFromUser = sendTypingToChat(existingUser.name);
        socket.emit(USER_CONNECTED, connectedUsers);
        console.log("user connected", connectedUsers);
      } else {
        console.log("no users found");
      }
    } catch (error) {
      console.error("Error handling USER_CONNECTED event:", error);
    }
  });

  socket.on(REMOVE_FROM_COMMUNITY, async (data) => {
    console.log("To Remove From Community", data);
    try {
      const user = connectedUsers[data.name];
      if (user) {
        await Community.findByIdAndUpdate(data.communityId, {
          $pull: { users: user._id },
        });
        await User.findByIdAndUpdate(user._id, {
          $pull: { communities: data.communityId },
        });
        console.log("User removed from community:", user.name);
      }
      connectedUsers = removeUser(connectedUsers, data.name);
      socket.emit(USER_DISCONNECTED, connectedUsers);
      if (communityChat) {
        socket.emit(`${MESSAGE_RECIEVED}-${communityChat._id}`, {
          message: `${data.name} removed from the room.`,
        });
      }
      console.log("Remove From Community", connectedUsers);
    } catch (error) {
      console.error("Error handling REMOVE_FROM_COMMUNITY event:", error);
    }
  });

  socket.on(LEAVE_COMMUNITY, async (data) => {
    try {
      if (data) {
        const communityId = data.communityId;
        const user = connectedUsers[data.name];
        await Community.findByIdAndUpdate(communityId, {
          $pull: { users: user._id },
        });
        await User.findByIdAndUpdate(user._id, {
          $pull: { communities: communityId },
        });
        if (communityChat) {
          io.emit(`${MESSAGE_RECIEVED}-${communityChat._id}`, {
            message: `${data.user} has left the community.`,
          });
        }
        console.log("User left community:", data.user);
      }
    } catch (error) {
      console.error("Error handling LEAVE_COMMUNITY event:", error);
    }
  });

  socket.on(LOGOUT, (data) => {
    try {
      socket.emit(USER_DISCONNECTED, connectedUsers);
      connectedUsers = removeUser(connectedUsers, data.name);
      console.log("Logged out", connectedUsers);
    } catch (error) {
      console.error("Error handling LOGOUT event:", error);
    }
  });

  socket.on(COMMUNITY_CHAT, async (data) => {
    try {
      console.log("Community chat request received", data);
      const communityName = data.name;
      const community = await Community.findOne({ name: communityName })
        .populate("chats")
        .populate("users");
      console.log("Community data:", community);
      if (!community) {
        const newCommunityChat = await Chat.create({ messages: [] });
        communityChat = await Community.create({
          name: communityName,
          chats: [newCommunityChat._id],
          users: [],
        });
        socket.emit(COMMUNITY_CHAT, newCommunityChat);
      } else {
        const last10Messages = community.chats[0].messages.slice(-10);
        socket.emit(COMMUNITY_CHAT, {
          ...community.chats[0].toObject(),
          messages: last10Messages,
        });
      }
    } catch (error) {
      console.error(
        "Error retrieving community chat from the database:",
        error
      );
    }
  });

  socket.on(JOIN_COMMUNITY, async (data) => {
    const communityName = data.name;
    try {
      const community = await Community.findOne({ name: communityName });
      if (community) {
        const user = connectedUsers[data.user]._id;
        console.log("JOIN_COMMUNITY connectedUsers: ", user);
        await Community.findByIdAndUpdate(community._id, {
          $addToSet: { users: user },
        });
        await User.findByIdAndUpdate(user, {
          $addToSet: { communities: community._id },
        });
        socket.emit(JOIN_COMMUNITY_SUCCESS, { communityId: community._id });
        socket.emit(`${MESSAGE_RECIEVED}-${community._id}`, {
          message: `${socket.user.name} has joined the community.`,
        });
      } else {
        socket.emit(JOIN_COMMUNITY_FAILURE, { error: "Community not found" });
      }
    } catch (error) {
      console.error("Error handling JOIN_COMMUNITY event:", error);
    }
  });

  socket.on(MESSAGE_SENT, async (data, { chatId, message }) => {
    try {
      const user = await User.findOne({ name: data.name });
      if (user) {
        console.log("user in message sent: ", user);
        const newMessage = { sender: user._id, message: message };
        const savedMessage = await new Message(newMessage).save();
        console.log("saved message here:", savedMessage);
        await Chat.findByIdAndUpdate(chatId, {
          $push: { messages: savedMessage._id },
        });
        await User.findOneAndUpdate(
          { name: data.name },
          { $push: { chats: chatId } }
        );
        socket.emit(chatId, savedMessage);
      }
    } catch (error) {
      console.error("Error saving message to the database:", error);
    }
  });

  socket.on(TYPING, ({ chatId, isTyping }) => {
    console.log("TYPING: ", chatId, isTyping);
    socket.emit(chatId, isTyping);
  });

  socket.on(PRIVATE_MESSAGE, async ({ receiver, sender, activeChat }) => {
    console.log("connected Users: ", connectedUsers);
    console.log("community chat: ", communityChat);
    if (receiver in connectedUsers) {
      const receiverSocket = connectedUsers[receiver].socketId;
      console.log("receiverSocket: ", receiverSocket);
      try {
        if (
          !activeChat ||
          !activeChat.id ||
          activeChat.id === communityChat._id
        ) {
          const findChat = await Private.findOne({
            $and: [
              {
                $or: [
                  { sender: sender, receiver: receiver },
                  { sender: receiver, receiver: sender },
                ],
              },
            ],
          });
          if (!findChat) {
            const newChat = await Chat.create({
              messages: [],
            });

            console.log("New Chat created:", newChat);
            const privatChat = await Private.create({
              sender: sender,
              receiver: receiver,
              chatId: newChat._id,
            });
            socket.to(receiverSocket).emit(PRIVATE_MESSAGE, privatChat);
            socket.emit(PRIVATE_MESSAGE, privatChat);
          } else {
            socket.to(receiverSocket).emit(PRIVATE_MESSAGE, activeChat);
          }
        } else {
          socket.to(receiverSocket).emit(PRIVATE_MESSAGE, activeChat);
          console.log("Active chat sent to receiver");
        }
      } catch (error) {
        console.error("Error creating/sending private chat:", error);
      }
    }
  });
};

function sendTypingToChat(user) {
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, { user, isTyping });
  };
}
function addUser(userList, user) {
  let newList = Object.assign({}, userList);
  console.log("user here from addUser: ", user);
  newList[user.name] = user;
  return newList;
}
function removeUser(userList, username) {
  let newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
}
