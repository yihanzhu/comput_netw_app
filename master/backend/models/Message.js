const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  studentId: String,
  text: String
});

module.exports = mongoose.model('Message', MessageSchema);
