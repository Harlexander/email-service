import { Request, Response } from "express";
import { validateEmail } from "../lib/validateEmail";
import validate from "deep-email-validator";

export const verifyEmail = async (req:Request, res:Response) => {
    try {
        const { email } = req.body;

        if(!email) res.send("Email required").status(404);

        const status = await validate({
            email : email, 
            validateRegex : true,
            validateMx : true,
            validateDisposable : true, 
            validateSMTP : true,
            validateTypo : false
        });

        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({ message : (error as Error).message });
    }
}