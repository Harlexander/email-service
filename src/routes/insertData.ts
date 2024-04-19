import { Request, Response } from "express";
import { insertData } from "../lib/insertData";
import { readCSVFile } from "../lib/readFile";
import { validateEmail } from "../lib/validateEmail";
import { Queue, Worker } from "bullmq";
import { MyJobData } from "../lib/conn";
import IORedis from 'ioredis';

const mysql = require('mysql2');

export const validateDb = mysql.createPool({
    host: "localhost",
    user: "peachy",
    password: "12345678",
    database: "costal-313235b529",
    connectionLimit: 10 // Adjust as needed
});

export const toDB = async (req:Request, res:Response) => {
    try {
        const conn = await validateDb.promise();
        const {
            databaseName,
            tableName,
        } = req.body;

        const { file } = req;

        if(file){
            const validationData = {
                dbName : databaseName,
                tableName,
                file : file?.path
            }
 
            await insertData(conn, "validation", validationData)
            
            await validateEmails(databaseName, tableName, file)            
        }

        res.send(file?.path);            
    } catch (error) {
        res.status(500).send((error as Error).message);
    }
}


const validateEmails = async (databaseName:string, tableName:string, file:Express.Multer.File) => {
    const pool = mysql.createPool({
        host: "localhost",
        user: "peachy",
        password: "12345678",
        database: databaseName,
        connectionLimit: 10 // Adjust as needed
    });

    const connection = new IORedis({
        host: process.env.REDIS_HOST,
        port: 14692,
        password : process.env.REDIS_PASS,
        maxRetriesPerRequest : null
      });
       
    const promisePool = pool.promise();

    const myQueue = new Queue<MyJobData>('verify_email', {connection});
          
    const worker = new Worker<MyJobData>('verify_email', async ({ data }) => { 
        const status = await validateEmail(data.data.email);
        status && await insertData(promisePool, data.tableName, data.data);
        return { status };
    }, { connection });

    worker.on('completed', async ({data}, { status }) => {
        await recordValidation([data.databaseName, data.tableName, data.file], status)
    });
    
    worker.on('failed', (job, err) => {
      console.log(`${job?.id} has failed with ${err.message}`);
    });

    if(file?.path){
        const datas = await readCSVFile(file.path);
        const jobs = datas.map((content: Record<string, string>) => ({ name : "validateEmail", data : { databaseName, tableName, file : file.path, data : content } }))
        await myQueue.addBulk(jobs)
    }
}
    

const recordValidation = async (values:string[], passed : boolean) => {
    const conn = validateDb.promise();

    let sql = `UPDATE validation SET validated = validated + 1`;

    if (passed) {
        sql += `, passed = passed + 1`;
    }

    sql += ` WHERE dbName = ? AND tableName = ? AND file = ?`;

    await conn.execute(sql, values);
}