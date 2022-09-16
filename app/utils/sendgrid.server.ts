import { MailDataRequired } from "@sendgrid/mail";
import * as sendgrid from "@sendgrid/mail";
import { generatePasswordResetToken, getUserByEmail } from "./user.server";


if (process.env.NODE_ENV === "production") {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is not set");
  }

  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendForgotPasswordMail(email: string) {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  try {
    const user = await getUserByEmail(email);

    if (!user) return;

    const token = generatePasswordResetToken(user.id);

    const mail: MailDataRequired = {
      to: email,
      from: "softwarecitadel@gmail.com",
      subject: "Réinitialisez votre mot de passe",
      html: `<a href="${process.env.BASE_URL}/reset-password/${token}">Réinitialisez votre mot de passe</a>`,
    };

    await sendgrid.send(mail);
  } catch {}
}
