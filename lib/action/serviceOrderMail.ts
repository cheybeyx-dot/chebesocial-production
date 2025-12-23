"use server";

import nodemailer from "nodemailer";
import { emailTemplate } from "../nodemailer/email-template";

export async function sendEmail({
  message,
  price,
  type,
  service,
  quantity,
  adlink,
  email,
  firstName,
}: {
  message: string;
  price: number;
  type: string;
  service: string;
  quantity: number;
  adlink: string;
  email: string | undefined;
  firstName: string | undefined;
}) {
  // Get any other custom fields here

  if (!message) {
    return {
      success: false,
      message: "Missing required fields",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: "A user has paid for Services",
      html: emailTemplate({
        subject: "A user has paid for Services",
        message: message.replace(/\n/g, "<br />"),
        price,
        type,
        service,
        quantity,
        adlink,
        email,
        firstName,
      }),
    });

    return {
      success: true,
      message: "Email sent successfully!",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send email",
    };
  }
}
