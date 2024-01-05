import mongoose from "mongoose";

const Schema = mongoose.Schema

const billingSchema = new Schema({
    name: String,
    team: String,
    projectname: String,
    reportDate: Date,
    empId: String,
    batch: Number,
    // associated:{
    //     annotation: Number,
    //     qc: Number,
    //     pm: Number,
    //     total: Number
    // },
    // hours:{
    //     annotation: Number,
    //     qc: Number,
    //     pm: Number,
    //     training: Number,
    //     ojt: Number,
    //     qcFeedback: Number,
    //     other: Number,
    //     idle: Number,
    //     total: Number,
    //     comments: String
    // },
    jobs:{
        // annotation: Number,
        managerTeam: String,
        // qc: Number,
        status1: String,
        cDate: Date,
        // total: Number
    }
},{
    timestamps: true
})

const Billing = mongoose.model('Billing',billingSchema)

export default Billing