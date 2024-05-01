import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { emailTasks } from "./routes/validateEmail";
import { scanEmails } from "./routes/emailDispatch";
import { toDB } from "./routes/insertData";
import path from "path";
import { verifyEmail } from "./routes/verifyEmail";
const multer  = require('multer')
const upload = multer({ dest: './public/uploads/' })
const ejs = require('ejs');
const moment = require('moment');

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

const mysql = require('mysql2');

app.use(express.json());

app.set('views', './public/views/dashboard');
 
app.set('view engine', 'ejs');

interface Validation {
  dbName : string,
  passed : number,
  validated : number,
  file : string,
  tableName : string,
  createdAt : Date
}

app.get("/", async (req: Request, res: Response) => {
  try{
  const connect = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      connectionLimit: 10 // Adjust as needed
  })

  const conn = await connect.promise();

  const query = 'SELECT * FROM validation';
  const data = await conn.execute(query);

  const formattedData = data[0].map((data:Validation) => ({...data, createdAt : moment(data.createdAt).format('MMM Do, h:mm:ss a')}));
  let totalPassed = 0;
  let totalValidated = 0;

  data[0].forEach((data:Validation) =>  totalPassed += data.passed);
  data[0].forEach((data:Validation) =>  totalValidated += data.validated);

  res.render("index", { 
    data : formattedData,
    totalPassed,
    totalValidated
   });

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