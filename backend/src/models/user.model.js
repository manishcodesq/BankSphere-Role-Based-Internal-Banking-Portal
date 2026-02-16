import mongoose , { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema= new Schema({
    name: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
},{
  timestamps: true
});

userSchema.pre('save', async function() {
  const user = this;
  if (!user.isModified('password')) return ;  
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
    email: user.email
  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
 )};

export const User = mongoose.model('User', userSchema);