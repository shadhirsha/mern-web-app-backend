import User from "../models/user.js";
import {hashPassowrd, comparePassword} from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req,res) => {
  try {
    //1. Dstructure
    const {name, email, password} = req.body;

    //2. All fields requrie
    if (!name.trim()) {
      return res.json({error: "Name is Requried"});
    }
    if (!email) {
      return res.json({error: "Email is Requried"});
    }
    if (!password || password.length < 6) {
      return res.json({error: "Password must be atleast 6 charaters long"});
    }

    //3. check whether the email taken
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.json({ error: "Email is Taken"});
    }

    //4. hash Password
    const hashedPassowrd = await hashPassowrd(password);

    //5. Register User
    const user = await new User({
      name, 
      email, 
      password: hashedPassowrd
    }).save();

    //6. Create signed jwt
    const token = jwt.sign({_id: user._id}, "NCEIF3903JV03VNDIN", {
      expiresIn: "7d",
    });

    //7. Send Response
    res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
      token,
    });
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req,res) => {
  try {
    //1. Dstructure
    const {email, password} = req.body;

    //2. All fields requrie
    if (!email) {
      return res.json({error: "Email is Requried"});
    }
    if (!password) {
      return res.json({error: "Please enter the Password"});
    }

    //3. check whether the email taken
    const user = await User.findOne({email});
    if (!user) {
      return res.json({ error: "User not Found"});
    }

    //4. hash Password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({error: "Wrong Password"});
    }

    //5.Create signed jwt
    const token = jwt.sign({_id: user._id}, "NCEIF3903JV03VNDIN", {
      expiresIn: "7d",
    });

    //7. Send Response
    res.json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
      token,
    });
  } catch (err) {
    console.log(err);
  }
};

export const secret = async (req, res) => {
  res.json({currentUser: req.user});
};