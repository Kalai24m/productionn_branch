// attendance.model.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createStatus: String,

});

const Status = mongoose.model('creStatus', CreSchema );

export default Status;
