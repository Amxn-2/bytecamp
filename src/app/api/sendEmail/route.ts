import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { subject, text, recipient } = await request.json();

    // Create a transporter using Mailtrap's SMTP settings
    const transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: '"Mumbai Health Alerts" <alerts@mumbahealth.com>',
      to: recipient,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.error();
  }
}
