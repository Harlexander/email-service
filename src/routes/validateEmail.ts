import { Request, Response } from "express";
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { validateEmail } from "../lib/validateEmail";
import { readCSVFile } from "../lib/readFile";
import Bottleneck from "bottleneck";
const fs = require('fs').promises;
const path = require('path');

export const emailTasks = async (req:Request, res:Response) => {
try {
          interface MyJobData {
            email: string;
            qux?: string;
            createdAt ?: string;
            firstName : string;
            lastName ?: string;
          }

          const limiter = new Bottleneck({
            maxConcurrent : 10,
            minTime : 10000
          });


          const limiterValidateEmail = limiter.wrap(async (job:any) => {
            const { email } = job.data;
            const status = await validateEmail(email)
            return { status };
          });

          const connection = new IORedis({
            host: 'redis-14692.c321.us-east-1-2.ec2.cloud.redislabs.com',
            port: 14692,
            password : "jgIl3D0x1L32V0h8bsf5UuU4cCdZj0tJ",
            maxRetriesPerRequest : null
          });
           
          const myQueue = new Queue<MyJobData>('validate', {connection});
          
          const worker = new Worker<MyJobData>('validate', async (job) => { 
            const { email } = job.data; 
            const status = await validateEmail(email)
            return { status };
          }, { connection });
 
          worker.on('completed', async (job, { status }) => {
            if(status){
              await writeResultToCSV(job.data)
            }
            console.log(job.data, status);              
          });
          
          worker.on('failed', (job, err) => {
            res.send(`${job?.id} has failed with ${err.message}`);
          });
          
          async function addJobs() {
            const filePath = `./public/small.csv`;
            const emails = await readCSVFile(filePath);
            console.log(emails)
            const jobs = [emails[0], emails[1]].map((data) => ({ name : "myJobName", data }))
            await myQueue.addBulk(jobs);
          }
        
          await addJobs();
        
          res.send("task running");
} catch (error) {
    res.status(500).send((error as Error).message);
}
}

function objectToCsvLine(obj:any) {
  const values = Object.values(obj).map(value => {
    // Ensure values are properly formatted (e.g., wrap in double quotes if needed)
    return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
  });

  return values.join(',');
}

async function writeResultToCSV(result:any) {
  const outputPath = './public/results.csv';

  try {
    const csvLine = objectToCsvLine(result);
    console.log(csvLine)
    // await fs.appendFile(outputPath, csvLine);
  } catch (error) {
    console.error(`Error writing result to CSV: ${(error as Error).message}`);
  }
}

