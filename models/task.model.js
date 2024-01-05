// attendance.model.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createTask: String,

});

const Task = mongoose.model('creTask', CreSchema );

export default Task;
