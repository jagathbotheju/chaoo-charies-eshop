"use server";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { FieldValues } from "react-hook-form";
import prisma from "./prismadb";

export const signupUser = async (formData: FieldValues) => {
  try {
    const { name, email, password } = formData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Internal Server Error",
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Internal Server Error",
    };
  }
};
