// attendance.model.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AttSchema = new Schema({
  name: String,
  empId: String,
  checkInTime: String,
  checkOutTime: String,
  total: String,
  currentDate: { type: Date, default: Date.now }, // Add a field for the current date
});

const Attendance = mongoose.model('checkuser', AttSchema);

export default Attendance;
