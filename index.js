// const express = require('express');
// const mongoose = require('mongoose');
// const User = require('./src/models/User');
// const Room = require('./src/models/Room');
// const Message = require('./src/models/Message');

// const app = express();
// PORT = 3000;
// app.use(express.json());
// const connectDB = require('./db');


// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const httpServer = createServer(app);
// const io = new Server(httpServer, { /* options */ });


// app.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         console.log(username);
//         console.log(password);
        
//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Username already taken' });
//         }
//         console.log("vjkvjbdsbvk");
        
//         const user1 = new User({ username, password,online });
//         await user1.save();
//         res.status(201).send("Registered Successfully");
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         const user = await User.findOne({ username });
//         if (!user || user.password !== password) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         user.online = true;
//         await user.save();

//         res.send("Login Successfully");
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// });
// app.post("/room" ,async (req, res) => {
//   try {
//         const room = new Room({
//         name: req.body.name,
//         members: req.body.members,
//     });
//     await room.save();
//     res.send("Room Created Successfully!!!!!");
//     res.status(201).json(room);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });

//   }
// });

// // msg between two users
// app.get("/message/:userId/:otherUserId", async (req, res) => {
//   const { userId, otherUserId } = req.params;
//   try {
//     const messages = await Message.find({
//       $or: [
//         { senderId: userId, receiverId: otherUserId },
//         { senderId: otherUserId, receiverId: userId },
//       ],
//     })
//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching messages" });
//   }
// });

// //Send msg group
// app.post("/group", async (req, res) => {
//     const msg = new Message({
//       senderId: req.body.senderId,
//       roomId: req.body.roomId,
//       content: req.body.content,
//       type: "group",
//     });
//     await msg.save();
//     res.status(201).json(msg);
//   });
// // msg send to room
// app.get("/room/:roomId",  async (req, res) => {
//     const roomId = req.params.roomId;
//     const messages = await Message.find({ roomId }).sort({ timestamp: 1 });
//     res.json(messages);
// });


// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("disconnect", async () => {
//     console.log("User disconnected", socket.id);
//     // Optionally set user offline in DB if you store mapping of userID to socket ID
//   });
// });
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const User = require('./src/models/User');
const Room = require('./src/models/Room');
const Message = require('./src/models/Message');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

const PORT = 3000;

app.use(cors());
app.use(express.json());



// Register
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const user = new User({ username, password });
    await user.save();
    res.status(201).send("Registered Successfully");
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    user.online = true;
    await user.save();
    res.send("Login Successfully");
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post("/room", async (req, res) => {
  try {
    const room = new Room({
      name: req.body.name,
      members: req.body.members,
    });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/message/:userId/:otherUserId", async (req, res) => {
  const { userId, otherUserId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
});

app.post("/group", async (req, res) => {
  try {
    const msg = new Message({
      senderId: req.body.senderId,
      roomId: req.body.roomId,
      content: req.body.content,
      type: "group",
    });
    await msg.save();
    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/room/:roomId", async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room messages' });
  }
});

const socketUserMap = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", async (userId) => {
    socket.join(userId);
    socketUserMap.set(socket.id, userId);
    await User.findByIdAndUpdate(userId, { online: true });
    console.log(`User ${userId} joined their room`);

    // Emit missed private messages
    const missedMessages = await Message.find({
      receiverId: userId,
      seen: false,
      type: 'private'
    });

    for (const msg of missedMessages) {
      socket.emit("receive_message", msg);
    }

    await Message.updateMany({ receiverId: userId, seen: false, type: 'private' }, { $set: { seen: true } });
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on("send_message", async (data) => {
    const { senderId, receiverId, content } = data;
    const newMessage = new Message({ senderId, receiverId, content, type: 'private', timestamp: new Date() });
    await newMessage.save();
    io.to(receiverId).emit("receive_message", newMessage);
  });

  socket.on("send_group_message", async (data) => {
    const { senderId, roomId, content } = data;
    const newMessage = new Message({ senderId, roomId, content, type: 'group', timestamp: new Date() });
    await newMessage.save();
    io.to(roomId).emit("receive_group_message", newMessage);
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected", socket.id);
    const userId = socketUserMap.get(socket.id);
    if (userId) {
      await User.findByIdAndUpdate(userId, { online: false });
      socketUserMap.delete(socket.id);
    }
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
