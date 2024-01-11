import path from "path";
import fs from 'fs';
import { promisify } from "util";
import { emailer } from "./nodemailer";
import { findAndReplace } from "./findReplace";

export const sendEmail = async (receiver: string[], subject:string, html:string, replace : {value : string | number , key : string}[]) => {
        const readFile = promisify(fs.readFile);
        const filePath = path.resolve("public", html);

        const htmlContent = await readFile(filePath);

        let htmlText = htmlContent.toString();

        htmlText = findAndReplace(htmlText, replace);

        const modifiedData = Buffer.from(htmlText);

        
        await emailer(receiver, subject, modifiedData);

        return;
}