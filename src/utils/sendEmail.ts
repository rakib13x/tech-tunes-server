import nodemailer from "nodemailer";
import config from "../config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: config.NODE_ENV === "production",
  auth: {
    user: config.smtp_auth_user,
    pass: config.smtp_auth_password,
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: "SSLv3",
  },
});

type TSendEmail = {
  to: {
    name: string;
    address: string;
  };
  subject: string;
  text: string;
  html: string;
};

const sendEmail = async ({
  to: { name, address },
  subject,
  text,
  html,
}: TSendEmail) => {
  try {
    // send mail with defined transport object
    await transporter.sendMail({
      from: {
        name: "Tech Tips Hub",
        address: config.nodemailer_email_from as string,
      },
      to: {
        name: name,
        address: address,
      }, // list of receivers
      subject,
      text,
      html,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export default sendEmail;
