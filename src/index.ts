import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { emailTasks } from "./routes/validateEmail";
import { scanEmails } from "./routes/emailDispatch";
import { toDB } from "./routes/insertData";
const multer  = require('multer')
const upload = multer({ dest: './public/uploads/' })

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/task", emailTasks);

app.post("/emails", scanEmails);

app.post("/database", upload.single("file"), toDB);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});