import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { emailTasks } from "./routes/send-emails";
import { scanEmails } from "./routes/scanEmail";


const emailValidator = require('deep-email-validator');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/verify-email", async (req: Request, res: Response) => {
  const result =   await emailValidator.validate({
    email: req.body.email,
    validateRegex: true,
    validateMx: true,
    validateTypo: false,
    validateDisposable: true,
    validateSMTP: false,
  })

  res.send(result);
})

app.post("/task", emailTasks);

app.post("/emails", scanEmails);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});