const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const { Server } = require("socket.io");
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const uploadPath = path.join(__dirname, 'codebase/uploads');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Socket.io connection
io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('update-view', (data) => {
      io.emit('update-view', data); // This broadcasts the message to all connected clients.
  });

  socket.on('disconnect', () => {
      console.log('user disconnected');
  });
});

// Store client connections
let clients = [];

// Endpoint to receive changes from the master
app.post('/admin-change', (req, res) => {
  const { selectedTab, selectedTabName } = req.body;
  // Inform all clients about the change
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify({ selectedTab, selectedTabName })}\n\n`);
  });
  res.sendStatus(200);
});

// Endpoint for slaves to listen to changes
app.get('/listen-to-changes', (req, res) => {
  res.set({
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
    "Connection": "keep-alive"
  });
  res.flushHeaders();

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});


// Routes
app.post('/api/upload', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field is used to retrieve the uploaded file
  let sampleFile = req.files.file;

  // Use the mv() method to place the file in upload directory (i.e. "uploads")
  sampleFile.mv(path.join(uploadPath, sampleFile.name), function (err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});

app.listen(5000, () => console.log('Server is running on port 5000'));
