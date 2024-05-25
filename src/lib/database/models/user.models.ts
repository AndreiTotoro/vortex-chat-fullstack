import { Document } from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  profilePicture: string;
  createdAt: Date;
  password: string;
}

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = models.User || model("User", UserSchema);

export default User;
