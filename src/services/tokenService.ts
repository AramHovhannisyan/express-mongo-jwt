import Jwt, { JwtPayload } from 'jsonwebtoken';
import { Token } from "../models/TokenModel";
import { userObjType, saveTokenObjType } from "../types/mongooseTypes";
import { config } from "../config/config";

const generateTokens = async (payload: userObjType) => {
  const accessToken = Jwt.sign(payload, config.jwt.access, {expiresIn: '30m'});
  const refreshToken = Jwt.sign(payload, config.jwt.refresh, {expiresIn: '30d'}); 

  return {
    access: accessToken,
    refresh: refreshToken,
  };
};

const saveToken = async ({id, refreshToken}: saveTokenObjType) => {
  const tokenData = await Token.findOne({user: id});

  if(tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }

  const token = await Token.create({user: id, refreshToken});

  return token;
};

const deleteToken = async (refreshToken: string) => {
  await Token.deleteOne({refreshToken});
};

const validateAccessToken = async (token: string) => {
  try {
    const payload = Jwt.verify(token, config.jwt.access) as JwtPayload;
    
    if(!payload) return null;
    
    return {
      id: payload.id,
      email: payload.email,
    };

  } catch (error) {
    console.log(error);
    
    return null;
  }
};

const validateRefreshToken = async (token: string) => {
  try {
    const payload = Jwt.verify(token, config.jwt.refresh) as JwtPayload;
    if(!payload) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { generateTokens, saveToken, deleteToken, validateAccessToken, validateRefreshToken };