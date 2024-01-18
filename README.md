# ChatApp-Task

### Description
Chat Application, while still in its infancy in terms of frontend design, shines brightly as a testament to my backend development prowess. As a dedicated backend engineer, I have poured my expertise into creating a robust and scalable platform that promises a seamless communication experience.

While the frontend design may not yet meet the aesthetic standards, it serves as a foundation that can be transformed into a visually stunning and user-friendly interface. As the driving force behind this project, my focus has been on ensuring the backend functionalities are top-notch, providing a solid foundation for future frontend enhancements.

**Technologies** :

_Node.js, Express.js, Socket.io, ReactJs_


**Features** :

- Verify User
- Logout
- Community Chat
    - Join Community
    - Leave Community
    - Remove From Communiy
- Message Typing
- Private Messages
- Notification on Join and Leaving Communities


To Run the Nodejs Server
```command
npm install
npm start
```
To Run The Frontend
```command
npm run react
```

***Using Postman's Socket.io***
- Socket server address
```link
http://localhost:3000
```
- Verify User
```json
{
    "name":"shaheer zeb"
}
```
- User Connection For Sockets
```json
{
    "name":"User Name"
}
```
- Joining Chat Community
```json
{
    "name":"My Community",
    "user": "User Name"
}
```
- Sending Messages
    - It accetps two json, one for the sender and other for the messages to a specific chat.
```json
{
    "name": "User Name/Sender"
}
{
    "chatId":"65a7c2a316056457523b2669",
    "message": "I have to tell you something, That the chat app is now working fine."
}
```
- Typing Notification
```json
{
    "chatId": "65a7c2a316056457523b2669",
    "isTyping": true/false
}
```
- Community Chat
```json
{
    "name": "Community Name"
}
```
- Sending Private Messages
```json
{
    "receiver": "Receiver Name",
    "sender": "Sender Name",
    "activeChat": "Chat ID <optional>"

}
```
- Logout From App
```json
{
    "name": "User Name"
}
```
- Leave Community
```json
{
    "name": "User Name",
    "communityId": "Community Id"
}
```
- Remove User From Community
```json
{
    "name": "User Name",
    "communityId": "Community Id"
}
```

## Data in Mongodb

### Users Collection:
![User Chats](https://github.com/shaheer-work/Ikonic-ChatApp/blob/main/Chats.PNG)

### Chat Communities
![Communities](https://github.com/shaheer-work/Ikonic-ChatApp/blob/main/Communities.PNG)

### Chat Messages
![Messages](https://github.com/shaheer-work/Ikonic-ChatApp/blob/main/Messages.PNG)

### Private Chat
![Private chat](https://github.com/shaheer-work/Ikonic-ChatApp/blob/main/PrivateChat.PNG)

### Chat Users
![Users](https://github.com/shaheer-work/Ikonic-ChatApp/blob/main/Users.PNG)


**Chats Print**
- Community
```
Community data: {
  _id: new ObjectId('65a9237155b00f0c9d8f6d2c'),
  name: 'My',
  chats: [
    {
      _id: new ObjectId('65a9237155b00f0c9d8f6d2a'),
      messages: [Array],
      __v: 0
    }
  ],
  users: [
    {
      _id: new ObjectId('65a8d7cd663e2867af8b5e4e'),
      name: 'shaheer zeb',
      socketId: 'A4wTjEUv138bxSsyAAAB',
      chats: [Array],
      __v: 0,
      communities: [Array]
    }
  ],
  __v: 0
}
```
- User Print
```
user in message sent:  {
  _id: new ObjectId('65a8d7cd663e2867af8b5e4e'),
  name: 'shaheer zeb',
  socketId: 'A4wTjEUv138bxSsyAAAB',
  chats: [
    new ObjectId('65a7c2a316056457523b2669'),
    new ObjectId('65a8d4b4dea49bc78184e260'),
    new ObjectId('65a8d4b4dea49bc78184e260'),
    new ObjectId('65a9237155b00f0c9d8f6d2a')
  ],
  __v: 0,
  communities: [ new ObjectId('65a9237155b00f0c9d8f6d2c') ]
}
```
- Message
```
saved message here: {
  sender: new ObjectId('65a8d7cd663e2867af8b5e4e'),
  message: 'hey there',
  _id: new ObjectId('65a923c255b00f0c9d8f6d2f'),
  time: 2024-01-18T13:12:34.439Z,
  __v: 0
}
```