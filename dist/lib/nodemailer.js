"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailer = void 0;
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
function emailer(receiver, subject, html, attachments) {
    return __awaiter(this, void 0, void 0, function* () {
        // send mail with defined transport object
        const info = yield transporter.sendMail({
            from: '"ISM" <test@christembassy-ism.com>', // sender address
            to: receiver, // list of receivers
            subject: subject, // Subject line 
            html: html,
            attachments: attachments
        });
        console.log("Message sent: %s", receiver);
        return;
    });
}
exports.emailer = emailer;
