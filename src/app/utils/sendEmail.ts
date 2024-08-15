import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production', // Use `true` for port 465, `false` for all other ports
    auth: {
      user: 'mahmudulhaquenoor@gmail.com',
      pass: 'ziej figq xzrg reyt',
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; font-size: 14px">
      <h2 style="color: #444;">Password Reset Request</h2>
      <p>We received a request to reset your password. Please click the button below to reset it within 10 minute:</p>
      <p style="text-align: center;">
        <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Your Password
        </a>
      </p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p style="margin-top: 20px;">Best regards,<br/>Programming Hero University</p>
    </div>
  `;

  await transporter.sendMail({
    from: 'mahmudulhaquenoor@gmail.com', // sender address
    to,
    subject: 'Reset Your Password Securely🔐', // Subject line
    text: 'We received a request to reset your password. You can reset it by clicking the link below:', // plain text body
    html, // html body
  });
};
