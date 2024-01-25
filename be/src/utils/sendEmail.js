import process from 'node:process';
import nodemailer from 'nodemailer';

const sendEmail = async ({ receiverEmail, subject, message }) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER_ID, SMTP_PASSWORD, SENDER_NAME, SENDER_EMAIL } = process.env;

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: SMTP_USER_ID,
      pass: SMTP_PASSWORD,
    },
  });

  const emailData = {
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: receiverEmail,
    subject: subject,
    html: message,
  };

  await transport.sendMail(emailData);
};

export default sendEmail;
