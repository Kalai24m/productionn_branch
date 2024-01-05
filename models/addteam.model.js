// attendance.model.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CreSchema = new Schema({
  createTeam: String,

});

const AddTeam = mongoose.model('creTeam', CreSchema );

export default AddTeam;
