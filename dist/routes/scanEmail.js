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
exports.scanEmails = void 0;
const readFile_1 = require("../lib/readFile");
const validateEmail_1 = require("../lib/validateEmail");
const scanEmails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = `${__dirname}/../public/emails.csv`;
    const emails = yield (0, readFile_1.readCSVFile)(filePath);
    const emailExtract = emails.map((email) => email.Email || email.email);
    for (const email of emailExtract) {
        const status = yield (0, validateEmail_1.validateEmail)(email);
        console.log(status, email);
    }
    res.send(emailExtract);
});
exports.scanEmails = scanEmails;
