import {JwtStrategy} from 'passport-jwt'
import { ExtractJwt } from 'passport-jwt'
import mongoose from 'mongoose'
// import User from '../models/user.model.js'
import Key from '../config/key.js';
// import passport from 'passport';
const User = mongoose.model("users")
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = Key.secretOrKey;

const pass = passport =>{
    passport.use(
        new JwtStrategy(opts,(jwt_payload, done)=>{
            User.findById(jwt_payload.id)
            .then(user=>{
                if(user){
                    return done(null, false);
                }
                return done(null, false);
            })
            .catch(err=>console.log(err));
        })
    )
}