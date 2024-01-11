import { Request, Response } from "express";
import { readCSVFile } from "../lib/readFile";
import { validateEmail } from "../lib/validateEmail";

export const scanEmails = async (req:Request, res:Response) => {
    const filePath = `${__dirname}/../public/emails.csv`;

    const emails = await readCSVFile(filePath);

    const emailExtract =  emails.map((email) => email.Email || email.email);

    for (const email of emailExtract) {
        const status =  await validateEmail(email);
        console.log(status, email);
    }

    res.send(emailExtract);
}