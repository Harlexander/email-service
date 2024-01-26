const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "christembassy-ism.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: 'test@christembassy-ism.com',
    pass: 'f6)+&]xI5lK*'
  }
});
// async..await is not allowed in global scope, must use a wrapper
export async function emailer(receiver:string[], subject:string, html:Buffer, attachments ?: { filename : string, content : Buffer | string}[]) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"ISM" <test@christembassy-ism.com>', // sender address
    to: receiver, // list of receivers
    subject: subject, // Subject line 
    html: html,
    attachments : attachments
  });

  console.log("Message sent: %s", receiver);

  return;
}