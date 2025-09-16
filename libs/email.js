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
  static ForgotPasswordEmail = (username, email, otp) => `
<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Password Reset OTP</title>
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
      text-align: center;
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
    .otp-code {
      display: inline-block;
      font-size: 32px;
      font-weight: 700;
      color: #1a73e8;
      padding: 16px 32px;
      border: 2px dashed #1a73e8;
      border-radius: 8px;
      margin: 24px 0;
      letter-spacing: 6px;
      user-select: all;
    }
    .info {
      background: #e8f0fe;
      border-left: 4px solid #4285f4;
      padding: 12px 16px;
      margin-bottom: 24px;
      border-radius: 4px;
      font-size: 15px;
      color: #202124;
      text-align: left;
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
    <p>We received a request to reset the password for the account associated with this email address (<em>${email}</em>).</p>
    <p>Please use the following One-Time Password (OTP) to proceed. This code is valid for the next 30 minutes.</p>
    <div class="otp-code">${otp}</div>
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
