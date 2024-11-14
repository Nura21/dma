const nodemailer = require("nodemailer");

async function sendEmailWithAttachment(user) {
  try {
    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.PASSWORD_APP,
      },
      debug: true,
    });

    const info = await transporter.sendMail({
      from: `Irfan <${process.env.EMAIL_SENDER}>`,
      to: user.email,
      subject: `REPORT`,
      text: "Please find the attached PDF report.",
      attachments: [
        {
          filename: "report.pdf",
          path: "public/docs/report.pdf",
        },
      ],
    });

    console.info(info.messageId);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { sendEmailWithAttachment };
