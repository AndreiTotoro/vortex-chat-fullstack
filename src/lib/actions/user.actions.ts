"use server";

import bcrypt from "bcryptjs";
import User, { IUser } from "../database/models/user.models";
import { createUserParams, UserType } from "@/types";
import { connectToDatabase } from "../database";

interface UserResponse {
  user?: UserType;
  error?: string;
}

export default async function registerUser(
  username: string,
  password: string
): Promise<UserResponse> {
  try {
    await connectToDatabase();

    const user: IUser | undefined | null = await User.findOne({
      username: username,
    });

    if (user) {
      return { error: "User already exists" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const profilePicture = `https://avatar.iran.liara.run/public/?username=${username}`;

    const newUser: createUserParams = {
      username: username,
      password: hashedPassword,
      profilePicture: profilePicture,
    };

    const createdUser: IUser = await User.create(newUser);

    if (!createdUser) {
      return { error: "User not created" };
    }

    return { user: JSON.parse(JSON.stringify(createdUser)) };
  } catch (error: any) {
    console.log(error);
    return { error: error.message };
  }
}
