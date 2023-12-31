import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  password: {
    type: String,
    required:true
  },
});

//static signup method
userSchema.statics.signup=async(email, password)=>{
  //validation
  if(!email || !password){
    throw Error("All fields must be filled");
  }
  if(!validator.isEmail(email)){
    throw Error("Not a valid email");
  }
  if(!validator.isStrongPassword(password)){
    throw Error("The password is not strong enough. Use characters, symbols tooo");
  }
  const exists= await User.findOne({email})
  if(exists){
    throw Error('Email already in use')
  }

  const salt=await bcrypt.genSalt(10);
  const hash=await bcrypt.hash(password, salt);

  const user=await User.create({email, password:hash});
  console.log(user)
  return user;

}

//static login user
userSchema.statics.login=async(email, password)=>{
  if(!email || !password){
    throw Error("All fields must be filled");
  }
  const user=await User.findOne({email});
  if(!user){
    throw Error('Incorrect email');
  }
  const match =await bcrypt.compare(password, user.password);
  if(!match){
    throw Error("Incorrect password");
  }

  return user;
}

const User=new mongoose.model('User', userSchema);
export default User;
