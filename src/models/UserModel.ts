import { Schema, model } from 'mongoose';
import { IUser } from "../types/mongooseTypes";

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});

const User = model<IUser>('User', userSchema);

export { User };