import nodemailer from 'nodemailer';
import { Account } from '../types/account';

class EmailerService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.office365.com', // Outlook SMTP server host
      port: 587, // Port for Outlook SMTP server
      secure: false, // TLS required, set to true if using SSL
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });
    this.verifyTransporter();
  }

  async verifyTransporter() {
    try {
      await this.transporter.verify();
      console.log('Emailer ready');
    } catch (error) {
      console.error('Emailer verification failed:', error);
    }
  }

  async sendMail(mailOptions: any) {
    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendValidationMail(user: Account) {
    console.log('user in send valid', user);
    try {
      const message = `http://localhost:3000/verify-account/${user.id}/?token=${user.token_validation}`;
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Matcha: Validation email',
        text: message,
      });
      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

export default new EmailerService();