import nodemailer from "nodemailer";
import { IEvent } from "../interfaces/event";
import { generateHtmlContent } from "../views/email";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface IEmailOptions {
  to: string;
  subject: string;
  event: IEvent;
}

export async function sendEmail(options: IEmailOptions) {
  const htmlContent = generateHtmlContent(options.event);
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Error sending email to ${options.to}:`, error);
    throw error;
  }
}
