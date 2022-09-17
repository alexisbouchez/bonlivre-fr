import type { User } from "@prisma/client";
import { db } from "./db.server";
import { sign, verify } from "jsonwebtoken";

async function isValidEmail(email: string) {
  if (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return true;
  }

  return false;
}

async function isEmailAlreadyUsed(email: string) {
  const emailAlreadyUsed = await getUserByEmail(email);

  if (emailAlreadyUsed) {
    return true;
  }

  return false;
}

export async function checkEmail(email: unknown, oldEmail?: string) {
  if (email === oldEmail) {
    return;
  }

  if (typeof email !== "string") {
    return "L'adresse électronique est invalide.";
  }

  if (!isValidEmail(email)) {
    return "L'adresse électronique est invalide.";
  }

  if (await isEmailAlreadyUsed(email)) {
    return "L'adresse électronique est déjà utilisée.";
  }
}

async function isUsernameAlreadyUsed(username: string) {
  const usernameAlreadyUsed = await getUserByUsername(username);

  if (usernameAlreadyUsed) {
    return true;
  }

  return false;
}

export async function checkUsername(username: unknown, oldUsername?: string) {
  if (oldUsername === username) {
    return;
  }

  if (typeof username !== "string") {
    return "Le nom d'utilisateur est invalide.";
  }

  if (username.length < 3 || username.length > 20) {
    return "Le nom d'utilisateur doit contenir entre 3 et 20 caractères.";
  }

  if (await isUsernameAlreadyUsed(username)) {
    return "Le nom d'utilisateur est déjà utilisé.";
  }

  if (!username.match(/^[a-zA-Z0-9_]+$/)) {
    return "Le nom d'utilisateur ne doit contenir que des caractères alphanumériques, ainsi que des tirets du bas.";
  }
}

export function checkPassword(password: unknown) {
  if (typeof password !== "string") {
    return "Le mot de passe est invalide.";
  }

  if (password.length < 6 || password.length > 100) {
    return "Le mot de passe doit contenir entre 6 et 100 caractères.";
  }
}

export function checkPasswords(
  password: unknown,
  confirmationPassword: unknown
) {
  if (!password) {
    return;
  }

  const passwordError = checkPassword(password);

  if (passwordError) {
    return passwordError;
  }

  if (typeof confirmationPassword !== "string") {
    return "Le mot de confirmation est invalide.";
  }

  if (password !== confirmationPassword) {
    return "Les mots de passe ne correspondent pas.";
  }
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  try {
    const user = await db.user.findFirst({ where: { username } });
    return user;
  } catch {
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const user = await db.user.findFirst({ where: { email } });
    return user;
  } catch {
    return null;
  }
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

export async function updateUser(
  id: string,
  updateUserData: UpdateUserInput
): Promise<User | null> {
  try {
    const user = await db.user.update({
      where: { id },
      data: updateUserData,
    });
    return user;
  } catch {
    return null;
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.review.deleteMany({ where: { userId } });
    await db.bookShelfItem.deleteMany({ where: { userId } });
    await db.user.delete({ where: { id: userId } });
  } catch {}
}

export function generatePasswordResetToken(userId: string) {
  const token = sign(userId, process.env.JWT_SECRET || "");
  return token;
}

export function getUserIdFromPasswordResetToken(token?: string) {
  if (!token) return null;
  try {
    const userId = verify(token, process.env.JWT_SECRET || "");
    return userId.toString();
  } catch {
    return null;
  }
}
