const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  grlvl: { type: String },
  address: { type: String },
  rfid: { type: String },
  lrn: { type: String },
  pic: { type: String }, // Will be used for Firebase storage URL
  sy: { type: String },
  parentName: { type: String },
  mobileNo: { type: String },
  hideStudent: { type: Boolean, default: false }
});

module.exports = mongoose.model('Student', studentSchema); 