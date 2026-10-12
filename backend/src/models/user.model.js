import mongoose , { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const userSchema= new Schema({
    name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true
  },
  role:{
    type: String,
    enum: ['customer','employee', 'manager' ,'admin'],
    default: 'customer',
    trim: true
  },
  password: {
    type: String,
    required: false
  },
  googleId: {
        type: String,
        default: null
    },

    avatar: {
        type: String,
        default: null
    }
},{
  timestamps: true
});

userSchema.pre('save', async function() {
  const user = this;
  if (!user.password || !user.isModified('password')) return ;  
  this.password = await bcrypt.hash(this.password, 10);
 
});

userSchema.methods.isPasswordMatch = async function(password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

userSchema.methods.generateAccessToken = function() {
  const user = this;
 return jwt.sign({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
 )};



export const User = mongoose.model('User', userSchema);