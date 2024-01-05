import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema =  new Schema({
    name: {
        type: String,
        required: true
      },
      empId:{
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true
      },
      role:{
        type: String,
        // required: false,
      },
      password: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      lastLogin: {
        type: Schema.Types.ObjectId,
        ref: 'LastLogin',
      },
      resetToken:String,
      expireToken:Date,
      
});

const User  = mongoose.model('users',UserSchema)

export default User;