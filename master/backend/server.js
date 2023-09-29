// require('dotenv').config();
// const mongoose = require('mongoose');
const Assignment = require("./models/Assignment");
const Message = require("./models/Message");

const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const WebSocket = require("ws");
// const fetch = require('node-fetch');  // Import this at the top with other imports

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
// ... rest of your imports ...

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const uploadPath = path.join(__dirname, "codebase/uploads");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(fileUpload());

app.post("/api/upload", function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
  }

  let sampleFile = req.files.file;
  sampleFile.mv(path.join(uploadPath, sampleFile.name), function (err) {
    if (err) {
      console.error("File upload error:", err);
      return res
        .status(500)
        .json({ message: "Server error during file upload." });
    }
    res.json({ message: "File uploaded!" });
  });
});

// mongoose.connect(process.env.DATABASE_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
// mongoose.connection.on('error', err => {
//   console.error(err);
// });
// mongoose.connection.once('open', () => {
//   console.log("Connected to database");
// });

// ... other required modules ...
io.on("connection", (socket) => {
  console.log("Master Backend Connected");

  // socket.on("tabConfirmed", async (tabIndex) => {
  //   console.log(`Tab ${tabIndex} confirmed from Master Frontend`);
  //   // Inform slave backend
  //   try {
  //     const response = await axios.post(
  //       "http://backend-slave:5100/confirmTab",
  //       {
  //         tabIndex,
  //       }
  //     );
  //     if (response.data.success) {
  //       console.log("Notified slave backend about tab confirmation");
  //     }
  //   } catch (error) {
  //     console.error("Error communicating with slave backend:", error);
  //   }
  // });

  socket.on("createAssignment", async (data) => {
    try {
      const assignment = new Assignment(data);
      await assignment.save();
      console.log("Assignment created and saved!");
      socket.emit("assignmentCreated", assignment);

      // Notify student backend
      io.to("http://localhost:5100").emit("updateAssignments", assignment); // Adjust the address to the correct one
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  });

  socket.on("fetchAllAssignments", async () => {
    try {
      const assignments = await Assignment.find();
      socket.emit("updateAssignments", assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  });

  socket.on("publishAssignment", async (assignment) => {
    try {
      // Find the assignment in the database and update its published status
      const updatedAssignment = await Assignment.findByIdAndUpdate(assignment._id, { published: true }, { new: true });
      
      // Notify the student backend of the published assignment
      io.to('http://localhost:5100').emit('updateAssignments', updatedAssignment); // Adjust the address to the correct one
      
    } catch (error) {
      console.error("Error publishing assignment:", error);
    }
  });
  

  socket.on("fetchMailbox", async () => {
    try {
      const messages = await Message.find();
      socket.emit("updateMailbox", messages);
    } catch (error) {
      console.error("Error fetching mailbox:", error);
    }
  });

  socket.on("sendReply", async (data) => {
    // Save the reply as a new message to the mailbox
    try {
      const reply = new Message(data);
      await reply.save();
      console.log("Reply sent and saved!");
      socket.emit("replyStatus", reply);
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  });
});

server.listen(5000, () => console.log("Server is running on port 5000"));
