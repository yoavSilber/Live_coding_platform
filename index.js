const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  path: "/socket.io",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./client/dist")));

mongoose
  .connect(process.env.MONGO_URL || "mongodb://localhost:27017/codeblocks")
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const codeBlockSchema = new mongoose.Schema({
  name: String,
  code: String,
  solution: String,
});

const CodeBlock = mongoose.model("CodeBlock", codeBlockSchema);

const initializeDatabase = async () => {
  const count = await CodeBlock.countDocuments();
  if (count === 0) {
    await CodeBlock.insertMany([
      {
        name: "Async Function",
        code: "// Async function example\nasync function fetchData() {\n  // Your code here\n}",
        solution: `async function fetchData() {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error fetching data:', error);\n  }\n}`,
      },
      {
        name: "Array Methods",
        code: "// Array methods example\nconst numbers = [1, 2, 3, 4, 5];\n// Transform the array",
        solution:
          "// Array methods example\nconst numbers = [1, 2, 3, 4, 5];\n// Transform the array\nconst doubled = numbers.map(num => num * 2);\nconst sum = numbers.reduce((total, num) => total + num, 0);\nconst evenNumbers = numbers.filter(num => num % 2 === 0);",
      },
      {
        name: "DOM Manipulation",
        code: "// DOM manipulation example\nfunction updateUI() {\n  // Your code here\n}",
        solution:
          "// DOM manipulation example\nfunction updateUI() {\n  const element = document.getElementById('result');\n  element.innerHTML = 'Updated content';\n  element.classList.add('highlight');\n  element.style.color = 'blue';\n}",
      },
      {
        name: "Promise Chain",
        code: "// Promise chain example\nfunction processData() {\n  // Your code here\n}",
        solution:
          "// Promise chain example\nfunction processData() {\n  return fetch('https://api.example.com/user')\n    .then(response => response.json())\n    .then(user => fetch(`https://api.example.com/posts/${user.id}`))\n    .then(response => response.json())\n    .catch(error => console.error('Error:', error));\n}",
      },
    ]);
    console.log("Database initialized with code blocks");
  }
};

initializeDatabase();

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist/index.html"));
});

app.get("/api/code-blocks", async (req, res) => {
  try {
    const codeBlocks = await CodeBlock.find({}, { name: 1 });
    res.json(codeBlocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/code-blocks/:id", async (req, res) => {
  try {
    const codeBlock = await CodeBlock.findById(req.params.id);
    if (!codeBlock) {
      return res.status(404).json({ message: "Code block not found" });
    }
    res.json(codeBlock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join-room", ({ roomId }) => {
    Object.keys(socket.rooms).forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });

    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        mentor: socket.id,
        students: [],
        currentCode: "",
      };
    } else if (!rooms[roomId].students.includes(socket.id) && socket.id !== rooms[roomId].mentor) {
      rooms[roomId].students.push(socket.id);
    }

    io.to(roomId).emit("room-info", {
      studentId: socket.id,
      studentCount: rooms[roomId].students.length,
      isMentor: socket.id === rooms[roomId].mentor,
    });

    socket.emit("code-update", rooms[roomId].currentCode || "");
  });

  socket.on("code-change", ({ roomId, code }) => {
    if (rooms[roomId]) {
      rooms[roomId].currentCode = code;
      socket.to(roomId).emit("code-update", code);
    }
  });

  socket.on("check-solution", async ({ roomId, code }) => {
    try {
      const codeBlockId = roomId;
      const codeBlock = await CodeBlock.findById(codeBlockId);
      function safeUnescape(str) {
        return str.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      }

      function normalizeCode(str) {
        const unescaped = safeUnescape(str);
        return unescaped
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .join("\n");
      }
      if (codeBlock && normalizeCode(code) === normalizeCode(codeBlock.solution)) {
        socket.emit("solution-correct", true);
      }
    } catch (error) {
      console.error("Error checking solution:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);

    Object.keys(rooms).forEach((roomId) => {
      if (rooms[roomId].mentor === socket.id) {
        io.to(roomId).emit("mentor-left");
        delete rooms[roomId];
      } else if (rooms[roomId].students.includes(socket.id)) {
        rooms[roomId].students = rooms[roomId].students.filter((id) => id !== socket.id);

        io.to(roomId).emit("room-info", {
          studentCount: rooms[roomId].students.length,
        });
      }
    });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
