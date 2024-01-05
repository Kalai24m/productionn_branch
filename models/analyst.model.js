import mongoose from "mongoose";
import moment from 'moment';

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  task: String,
  sessionOne: String,
});

const analystSchema = new Schema({
  name: String,
  team: {
    type: String,
    required: true,
  },
  empId: String,
  projectName: {
    type: String,
    required: true,
  },
  managerTask: {
    type: String,
    required: true,
  },
  dateTask: {
    type: Date,
    required: true,
  },
  sessionOne: [taskSchema], // Update to an array of tasks
  week: { type: Number, default: () => moment().format("W") },
  createdAt: { type: Date, default: () => moment().format('M D YYYY') },
});

const Analyst = mongoose.model('AnalystTask', analystSchema);

export default Analyst;
