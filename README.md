# Chat_Application
Chat-Application Client Server communication.
# 🗨️ Real-Time Chat Application

A real-time chat app built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO**. It supports private and group messaging, tracks user online status, and ensures offline messages are delivered when users return online.

---

## 🚀 Features

- 🔐 User Registration & Login
- 👤 Private 1-on-1 Messaging
- 👥 Group Chat Rooms
- 🟢 Online/Offline User Status
- 💬 Real-time Messaging with Socket.IO
- 📨 Offline Message Delivery
- 🌐 RESTful APIs for chat operations

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Real-time Engine:** Socket.IO

---
```bash
## 📁 Project Structure

Chat_Application/
├── server.js # Main server file
├── db.js # MongoDB connection
├── src/
│ ├── models/
│ │ ├── User.js # User schema
│ │ ├── Room.js # Room schema
│ │ └── Message.js # Message schema
├── package.json
└── README.md

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Bhavish511/Chat_Application.git
cd Chat_Application
2. Install Dependencies
bash
Copy
Edit
npm install
3. Start MongoDB
Make sure MongoDB is running on:

bash
Copy
Edit
mongodb://localhost:27017/chat-app
4. Run the Server
bash
Copy
Edit
node server.js
5. Access the App
Visit:

arduino
Copy
Edit
http://localhost:3000
🔌 Socket.IO Events
Client ➜ Server
Event	Description
join	Join user room by user ID
join_room	Join a group room by room ID
send_message	Send a private message
send_group_message	Send a message in a group room

Server ➜ Client
Event	Description
receive_message	Receive a private message
receive_group_message	Receive a group message

📤 Sample JSON Payloads
🧾 Register/Login
json
Copy
Edit
{
  "username": "john_doe",
  "password": "123456"
}
🏠 Create Room
json
Copy
Edit
{
  "name": "Dev Team",
  "members": ["userId1", "userId2"]
}
💬 Send Group Message
json
Copy
Edit
{
  "senderId": "userId1",
  "roomId": "roomId123",
  "content": "Hello team!"
}
📄 API Endpoints
🔑 Authentication
Method	Route	Description
POST	/register	Register a user
POST	/login	Login a user

💬 Messaging
Method	Route	Description
GET	/message/:userId/:otherUserId	Fetch 1-on-1 chat messages
POST	/group	Send a message to a group
GET	/room/:roomId	Get messages from a room

🏠 Rooms
Method	Route	Description
POST	/room	Create a group room

✅ Future Improvements
 JWT Authentication

 Read Receipts

 Typing Indicators

 Web or Mobile Frontend (React/Flutter)

 Dockerization for Deployment

🤝 Contributing
Contributions are welcome! Fork the repo and submit a pull request.

📄 License
This project is licensed under the MIT License.

👨‍💻 Author
Bhavish511
🔗 GitHub Profile

yaml
Copy
Edit

---
