

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const lastLoginSchema =  new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
      },
      loginTime: {
        type: Date,
        default: Date.now,
      },
});

const LastLogin = mongoose.model('LastLogin',lastLoginSchema)

export default LastLogin;
