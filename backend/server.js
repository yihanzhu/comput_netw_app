const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
const uploadPath = path.join(__dirname, 'codebase/uploads');


const cors = require('cors'); // Import cors module
app.use(cors()); // Use cors middleware

// Middleware
app.use(express.json());
app.use(fileUpload());

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
