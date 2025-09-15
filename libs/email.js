import nodemailer from "nodemailer"
import { env } from "../env.js"

/**
 * @typedef {Object} MailerCred
 * @property {string} user
 * @property {string} pass
 */

/**
 * SMTP Gmail Service singleton class
 */
export default class SMTPGmailService {
  /** @type {import("nodemailer").Transporter<import("nodemailer/lib/smtp-transport").SentMessageInfo>} */
  #transporter

  /** @type {SMTPGmailService} */
  static instance

  /**
   * @param {MailerCred} config
   * @returns {SMTPGmailService}
   */
  static getInstance(
    config = {
      user: env.EMAIL_ADDRESS,
      pass: env.EMAIL_TOKEN,
    },
  ) {
    if (!SMTPGmailService.instance) {
      SMTPGmailService.instance = new SMTPGmailService(config)
    }
    return SMTPGmailService.instance
  }

  /**
   * @param {MailerCred} config
   */
  constructor(config) {
    this.#transporter = nodemailer.createTransport({
      service: "gmail",
      auth: config,
    })
  }

  /**
   * @param {import("nodemailer/lib/mailer").Options} mail
   */
  async sendMail(mail) {
    await this.#transporter.sendMail(mail)
  }
}

/** @type {MailerCred} */
export const defMailCred = {
  user: env.EMAIL_ADDRESS,
  pass: env.EMAIL_TOKEN,
}

export class EmailTemplate {
  static ForgotPasswordEmail = (username, email, resetLink) => `
<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      background: #ffffff;
      margin: 40px auto;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgb(0 0 0 / 0.1);
      overflow: hidden;
      padding: 24px;
    }
    h1 {
      color: #003366;
      font-weight: 700;
      font-size: 24px;
      margin-bottom: 16px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      margin: 0 0 24px 0;
    }
    .info {
      background: #e8f0fe;
      border-left: 4px solid #4285f4;
      padding: 12px 16px;
      margin-bottom: 24px;
      border-radius: 4px;
      font-size: 15px;
      color: #202124;
    }
    .button {
      display: inline-block;
      background-color: #1a73e8;
      color: #ffffff !important;
      padding: 14px 28px;
      font-weight: 600;
      border-radius: 6px;
      text-decoration: none;
      font-size: 16px;
      box-shadow: 0 4px 15px rgb(26 115 232 / 0.4);
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #155ab6;
      box-shadow: 0 6px 20px rgb(21 90 182 / 0.6);
    }
    footer {
      margin-top: 40px;
      font-size: 13px;
      color: #888;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Password Reset Request</h1>
    <p>Hello <strong>${username}</strong>,</p>
    <p>We received a request to reset the password associated with this email address (<em>${email}</em>).</p>
    <p>If you made this request, please click the button below to reset your password. This link is valid for the next 30 minutes.</p>

    <a href="${resetLink}" class="button" target="_blank" rel="noopener noreferrer">Reset Password</a>

    <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>

    <div class="info">
      <strong>User info</strong><br />
      Username: ${username}<br />
      Email: ${email}
    </div>

    <p>Thanks,<br />The Support Team</p>

    <footer>
      &copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.
    </footer>
  </div>
</body>
</html>
`
}
