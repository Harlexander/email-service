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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const nodemailer_1 = require("./nodemailer");
const findReplace_1 = require("./findReplace");
const sendEmail = (receiver, subject = "Testing", html, replace) => __awaiter(void 0, void 0, void 0, function* () {
    const readFile = (0, util_1.promisify)(fs_1.default.readFile);
    const filePath = path_1.default.resolve("public", html);
    const htmlContent = yield readFile(filePath);
    let htmlText = htmlContent.toString();
    htmlText = (0, findReplace_1.findAndReplace)(htmlText, replace);
    const modifiedData = Buffer.from(htmlText);
    yield (0, nodemailer_1.emailer)(receiver, subject, modifiedData);
    return;
});
exports.sendEmail = sendEmail;
