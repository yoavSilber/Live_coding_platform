// Importing required modules
const express = require("express"); // Express is a web framework for building APIs and web applications.
const mongoose = require("mongoose"); // Mongoose is used to interact with MongoDB.
const cors = require("cors"); // CORS middleware allows cross-origin requests.
const http = require("http"); // HTTP module to create a server.
const socketIo = require("socket.io"); // Socket.IO enables real-time, bidirectional communication.
const path = require("path"); // Path module for working with file paths.

// Create an Express application
const app = express();

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow requests from any origin.
    methods: ["GET", "POST"], // Allow these HTTP methods.
  },
});

// Middleware setup
app.use(cors()); // Enable CORS for all routes.
app.use(express.json()); // Parse incoming JSON requests.

// Serve static files from the client dist directory
app.use(express.static(path.join(__dirname, "./client/dist"))); // Serve React app's static files

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/codeCollab")
  .then(async () => {
    console.log("Connected to MongoDB");
  }) // Log success message on connection.
  .catch((err) => console.error("MongoDB connection error:", err)); // Log error if connection fails.

// Define a Mongoose schema for code blocks
const codeBlockSchema = new mongoose.Schema({
  name: String, // Name of the code block.
  code: String, // Initial code snippet.
  solution: String, // Correct solution for the code block.
});

// Create a Mongoose model for the schema
const CodeBlock = mongoose.model("CodeBlock", codeBlockSchema);

// Function to initialize the database with default code blocks if empty
const initializeDatabase = async () => {
  const count = await CodeBlock.countDocuments(); // Count existing documents in the collection.
  if (count === 0) {
    // If no documents exist, insert default code blocks.
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
    console.log("Database initialized with code blocks"); // Log success message.
  }
};

// Call the function to initialize the database
initializeDatabase();

// Define API routes

// Explicitly handle the root route
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist/index.html"));
});

// Route to get a list of all code blocks (only their names)
app.get("/api/code-blocks", async (req, res) => {
  try {
    const codeBlocks = await CodeBlock.find({}, { name: 1 }); // Fetch only the 'name' field of all code blocks.
    res.json(codeBlocks); // Send the list as a JSON response.
  } catch (error) {
    res.status(500).json({ message: error.message }); // Send an error response if something goes wrong.
  }
});

// Route to get a specific code block by its ID
app.get("/api/code-blocks/:id", async (req, res) => {
  try {
    const codeBlock = await CodeBlock.findById(req.params.id); // Find the code block by its ID.
    if (!codeBlock) {
      return res.status(404).json({ message: "Code block not found" }); // Send a 404 response if not found.
    }
    res.json(codeBlock); // Send the code block as a JSON response.
  } catch (error) {
    res.status(500).json({ message: error.message }); // Send an error response if something goes wrong.
  }
});

// WebSocket room management

// Object to store information about active rooms
const rooms = {};

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id); // Log when a new client connects.

  // Event: Join a code block room
  socket.on("join-room", ({ roomId }) => {
    // Leave any previous rooms the client was in
    Object.keys(socket.rooms).forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room); // Leave the room.
      }
    });

    // Join the new room
    socket.join(roomId);

    // Initialize the room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        mentor: socket.id, // Assign the first client as the mentor.
        students: [], // Initialize an empty list of students.
        currentCode: "", // Initialize with no code.
      };
    } else if (!rooms[roomId].students.includes(socket.id) && socket.id !== rooms[roomId].mentor) {
      rooms[roomId].students.push(socket.id); // Add the client as a student if not already added.
    }

    // Emit room info to all clients in the room
    io.to(roomId).emit("room-info", {
      studentId: socket.id, // ID of the current client.
      studentCount: rooms[roomId].students.length, // Number of students in the room.
      isMentor: socket.id === rooms[roomId].mentor, // Whether the client is the mentor.
    });

    // Send the initial code to the client
    socket.emit("code-update", rooms[roomId].currentCode || "");
  });

  // Event: Handle code updates
  socket.on("code-change", ({ roomId, code }) => {
    if (rooms[roomId]) {
      rooms[roomId].currentCode = code; // Update the current code in the room.
      socket.to(roomId).emit("code-update", code); // Broadcast the updated code to everyone except the sender.
    }
  });

  // Event: Check if the solution is correct
  socket.on("check-solution", async ({ roomId, code }) => {
    try {
      const codeBlockId = roomId; // Use the room ID as the code block ID.
      const codeBlock = await CodeBlock.findById(codeBlockId); // Find the code block by its ID.
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
      // const normalizedCode = code.replace(/\\n/g, "\n");
      if (codeBlock && normalizeCode(code) === normalizeCode(codeBlock.solution)) {
        socket.emit("solution-correct", true); // Notify the client if the solution is correct.
      }
    } catch (error) {
      console.error("Error checking solution:", error); // Log any errors.
    }
  });

  // Event: Handle client disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id); // Log when a client disconnects.

    // Check if the disconnected client was a mentor or student
    Object.keys(rooms).forEach((roomId) => {
      if (rooms[roomId].mentor === socket.id) {
        io.to(roomId).emit("mentor-left"); // Notify students that the mentor left.
        delete rooms[roomId]; // Delete the room.
      } else if (rooms[roomId].students.includes(socket.id)) {
        rooms[roomId].students = rooms[roomId].students.filter((id) => id !== socket.id); // Remove the student.

        // Update the student count in the room
        io.to(roomId).emit("room-info", {
          studentCount: rooms[roomId].students.length,
        });
      }
    });
  });
});

// Start the server
const PORT = process.env.PORT || 5000; // Use the port from environment variables or default to 5000.
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log the port the server is running on.
});
