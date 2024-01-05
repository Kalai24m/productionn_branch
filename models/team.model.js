import mongoose from "mongoose";

const Schema = mongoose.Schema
const team = new Schema({
    team: String
},{
    timestamps: true
})

const Team = mongoose.model('Team',team)

export default Team