// attendance.model.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createManager: String,

});

const Manager = mongoose.model('creManager', CreSchema );

export default Manager;
