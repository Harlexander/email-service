import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { emailTasks } from "./routes/validateEmail";
import { scanEmails } from "./routes/emailDispatch";
import { toDB, validateDb } from "./routes/insertData";
import path from "path";
import { verifyEmail } from "./routes/verifyEmail";
const multer  = require('multer')
const upload = multer({ dest: './public/uploads/' })
const ejs = require('ejs');
const moment = require('moment');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.set('views', path.join(__dirname, 'dashboard'));
 
app.set('view engine', 'ejs');

app.get("/", async (req: Request, res: Response) => {
  try {
  const conn = validateDb.promise();

  const query = 'SELECT * FROM validation';
  const data = await conn.execute(query);

  const formattedData = data[0].map((data:any) => ({...data, createdAt : moment(data.createdAt).format('MMM Do, h:mm:ss a')}))

  res.render("index", { data : formattedData });

  } catch (error) {
    res.send((error as Error).message)
  } 
});

app.post("/task", emailTasks);

app.post("/emails", scanEmails);

app.post("/api/verify", verifyEmail);

app.post("/database", upload.single("file"), toDB);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});