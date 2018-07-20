const mongoose = require('mongoose');
const ChildSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required, required: true },
  gender: { type: String, required: true },
  notes: [ {type: String }]
});

module.exports = mongoose.model('Child', ChildSchema, 'Child');