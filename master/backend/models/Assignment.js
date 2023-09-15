const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  template: String,
  studentId: String,
  link: String
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
