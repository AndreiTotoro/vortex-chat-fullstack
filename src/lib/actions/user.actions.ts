"use server";

import bcrypt from "bcryptjs";
import User, { IUser } from "../database/models/user.models";
import { createUserParams, UserType } from "@/types";
import { connectToDatabase } from "../database";
import { revalidatePath } from "next/cache";

interface UserResponse {
  user?: UserType;
  error?: string;
}

export async function registerUser(
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
    revalidatePath("/register");
    return { user: JSON.parse(JSON.stringify(createdUser)) };
  } catch (error: any) {
    console.log(error);
    return { error: error.message };
  }
}

export async function loginUser(
  username: string,
  password: string
): Promise<UserResponse> {
  try {
    await connectToDatabase();

    const user: IUser | undefined | null = await User.findOne({
      username: username,
    });

    if (!user) {
      return { error: "Username or Password are incorrect." };
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return { error: "Username or Password are incorrect." };
    }

    revalidatePath("/login");
    return { user: JSON.parse(JSON.stringify(user)) };
  } catch (error: any) {
    console.log(error);
    return { error: error.message };
  }
}
