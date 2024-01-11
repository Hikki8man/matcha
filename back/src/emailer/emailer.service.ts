import nodemailer from 'nodemailer';
import { Account } from '../types/account';
import Mail from 'nodemailer/lib/mailer';
import { env } from '../config';

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
    } catch (error) {
      console.error('Emailer verification failed:', error);
    }
  }

  async sendMail(mailOptions: Mail.Options) {
    try {
      const info = await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendValidationMail(user: Account) {
    try {
      const verificationLink = `${env.FRONT_URL}/verify-account/${user.token_validation}`;
      const message = `
        <p>Bonjour ${user.firstname},</p>
        <p>Merci de vous être inscrit sur Matcha ! Veuillez cliquer sur le lien ci-dessous pour vérifier votre compte :</p>
        <a href="${verificationLink}">Vérifier votre compte</a>
        <p>Si vous n'avez pas créé de compte Matcha, vous pouvez ignorer cet e-mail en toute sécurité.</p>
        <p>Cordialement,<br/>L'équipe Matcha</p>
      `;
      await this.transporter.sendMail({
        from: env.EMAIL,
        to: user.email,
        subject: 'Matcha: Validation email',
        html: message,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendForgotPasswordMail(email: string, token: string) {
    try {
      const resetPasswordLink = `${env.FRONT_URL}/reset-password/${token}`;
      const message = `
        <p>Bonjour,</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe sur Matcha. Veuillez cliquer sur le lien ci-dessous pour effectuer la réinitialisation :</p>
        <a href="${resetPasswordLink}">Réinitialiser votre mot de passe</a>
        <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet e-mail en toute sécurité.</p>
        <p>Cordialement,<br/>L'équipe Matcha</p>
      `;

      await this.transporter.sendMail({
        from: env.EMAIL,
        to: email,
        subject: 'Matcha: Mot de passe oublié',
        html: message,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

export default new EmailerService();
