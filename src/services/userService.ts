import bcrypt from "bcrypt";
import { NextFunction, Request } from 'express';
import { JwtPayload } from "jsonwebtoken";
import problem from "../errorHandling/problem";
import { User } from "../models/UserModel";
import { userObjType } from "../types/mongooseTypes";
import { generateTokens, saveToken, deleteToken, validateAccessToken, validateRefreshToken } from "./tokenService";


const getAll = async () => {
  try {
    const users = await User.find();

    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createOne = async (email: string, password: string) => {
  try {
    const condidate = await User.findOne({email});

    if (condidate) {
      throw new Error("User With This Email Exists");
    }

    const passHash = await bcrypt.hash(password, 7);

    const newUser = new User({ email, password: passHash });

    const { _id: newUserId } = await newUser.save();

    if(!newUserId) {
      throw new Error("Mongoose Error");
    }    

    const payload = {
      id: newUserId,
      email
    };

    const tokens = await generateTokens({...payload});
    const tokenObj = {
      id: newUserId,
      refreshToken: tokens.refresh
    };
    
    await saveToken(tokenObj);
    
    return {
      ...tokens,
      user: payload,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getOne = async (email: string) => {
  const condidate = await User.findOne({email});

    if (!condidate) {
      return null;
    }

    return condidate;
};

const loginOne = async (payload: userObjType) => {
  const tokens = await generateTokens({...payload});
    const tokenObj = {
      id: payload.id,
      refreshToken: tokens.refresh
    };
    
    await saveToken(tokenObj);
    
    return {
      ...tokens,
      user: payload,
    };
};

const logoutOne = async (refreshToken: string) => {
  return await deleteToken(refreshToken);
};

const refreshOne = async (refreshToken: string) => {
  const token = await validateRefreshToken(refreshToken);
  if(!token){
    return null;
  }

  const payload = {
    id: token.id,
    email: token.email,
  };

  const tokens = await generateTokens({...payload});
  const tokenObj = {
    id: payload.id,
    refreshToken: tokens.refresh
  };
  
  await saveToken(tokenObj);
  
  return {
    ...tokens,
    user: payload,
  };
};

export { getAll, createOne, getOne, loginOne, logoutOne, refreshOne };