import { Types } from "mongoose";

interface IUser {
  password: string,
  email: string;
}

interface userObjType {
  id: Types.ObjectId,
  email: string,
}

interface saveTokenObjType {
  id: Types.ObjectId,
  refreshToken: string,
}

export { IUser, userObjType, saveTokenObjType };
