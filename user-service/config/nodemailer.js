import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "velvetroaststore@gmail.com",
    pass: "mhhrtmognqymbeza",
  },

  tls: {
    servername: 'smtp.gmail.com',
    rejectUnauthorized: false // Helps if there are local certificate issues
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  console.log("host: ", process.env.EMAIL_HOST);
  console.log("port: ", process.env.EMAIL_PORT);
  console.log("user: ", process.env.EMAIL_USER);
  console.log("pass: ", process.env.EMAIL_PASS);
  if (error) {
    console.log("Mailer Error:", error);
  } else {
    console.log("Mail server is ready to take our messages");
  }
});

export default transporter;