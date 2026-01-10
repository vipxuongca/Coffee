import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Helps if there are local certificate issues
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.log("Mailer Error:", error);
  } else {
    console.log("Mail server is ready to take our messages");
  }
});

export default transporter;