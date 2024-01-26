import { Request, Response } from "express";
import { readCSVFile } from "../lib/readFile";
import { validateEmail } from "../lib/validateEmail";
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { sendEmail } from "../lib/sendEmail";

const fs = require('fs');
const { promisify } = require('util');
const appendFileAsync = promisify(fs.appendFile);

const { performance } = require('perf_hooks');
// ...

export const scanEmails = async (req:Request, res:Response) => {
    
    const startTime = performance.now();
        
    interface MyJobData {
        email: string;
        qux?: string;
      }
      
      const connection = new IORedis({
        host: 'redis-14692.c321.us-east-1-2.ec2.cloud.redislabs.com',
        port: 14692,
        password : "jgIl3D0x1L32V0h8bsf5UuU4cCdZj0tJ",
        maxRetriesPerRequest : null
      });
      
      const myQueue = new Queue<MyJobData>('email', {connection});
      
      const worker = new Worker<MyJobData>('email', async (job) => {

      }, {connection});

      worker.on('completed', async (job, { status }) => {
     
        console.log(`${job.data.email} : ${status}!`);
      });
      
      worker.on('failed', (job, err) => {
        res.send(`${job?.id} has failed with ${err.message}`);
      });

    res.send("results");    
}