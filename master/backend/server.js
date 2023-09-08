
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const WebSocket = require('ws');
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

// ... other required modules ...
io.on("connection", (socket) => {
  console.log("Master Backend Connected");

  socket.on("tabConfirmed", async (tabIndex) => {
    console.log(`Tab ${tabIndex} confirmed from Master Frontend`);
    // Inform slave backend
    try {
        const response = await axios.post('http://backend-slave:5100/confirmTab', {
            tabIndex
        });
        if (response.data.success) {
            console.log("Notified slave backend about tab confirmation");
        }
    } catch (error) {
        console.error("Error communicating with slave backend:", error);
    }
});

});

server.listen(5000, () => console.log("Server is running on port 5000"));
