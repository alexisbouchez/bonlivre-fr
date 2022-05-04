import { User } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { db } from "./db.server";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends AuthCredentials {
  username: string;
}

export interface SignUpErrors extends Partial<SignUpData> {
  unkownError?: string;
}

export async function signUp(
  signUpData: SignUpData
): Promise<[null, User] | [SignUpErrors, null]> {
  const errors: SignUpErrors = {};

  try {
    // Hash password
    signUpData.password = await hash(signUpData.password, 10);

    // Insert user into database
    const createdUser = await db.user.create({ data: signUpData });

    // Return the user
    return [null, createdUser];
  } catch (error: any) {
    if (error.code === "P2002") {
      errors.email = "L'adresse électronique est déjà utilisée";
    } else {
      errors.unkownError = "true";
    }

    return [errors, null];
  }
}

export async function signIn({ email, password }: AuthCredentials) {
  // Verify email
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) {
    return null;
  }

  // Verify password
  const isCorrectPassword = await compare(password, user.password);
  if (!isCorrectPassword) {
    return null;
  }

  return user;
}
