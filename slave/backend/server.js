const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");

const WebSocket = require('ws');


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

app.post('/confirmTab', (req, res) => {
  const tabIndex = req.body.tabIndex;
  console.log(`Received tab ${tabIndex} confirmation from Master Backend`);

  // Emit to connected frontend clients
  io.emit("updateTab", tabIndex);
  res.json({ success: true });
});

io.on("connection", (socket) => {
  console.log("Slave Backend Connected");
});

server.listen(5100, () => console.log("Server is running on port 5100"));