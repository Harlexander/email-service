import { Request, Response } from "express";
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

export const emailTasks = async (req:Request, res:Response) => {
try {
        interface MyJobData {
            foo?: string;
            qux?: string;
          }
          const connection = new IORedis({
            host: 'redis-14692.c321.us-east-1-2.ec2.cloud.redislabs.com',
            port: 14692,
            password : "jgIl3D0x1L32V0h8bsf5UuU4cCdZj0tJ",
            maxRetriesPerRequest : null
          });
          
          const myQueue = new Queue<MyJobData>('foo', {connection});
          
          const worker = new Worker<MyJobData>('foo', async (job) => {

            await new Promise(resolve => setTimeout(resolve, 1000))
            console.log(job.data);
          }, {connection});

          worker.on('completed', (job) => {
            console.log(`${job.id} has completed!`);
          });
          
          worker.on('failed', (job, err) => {
            res.send(`${job?.id} has failed with ${err.message}`);
          });
            
          async function addJobs() {
            await myQueue.add('myJobName', { foo: 'bar' });
            await myQueue.add('myJobName', { qux: 'baz' });
            await myQueue.add('myJobName', { qux: 'baz' });
            await myQueue.add('myJobName', { qux: 'baz' });
            await myQueue.add('myJobName', { qux: 'baz' });
          }
        
          await addJobs();
        
          res.send("omom man")
} catch (error) {
    res.status(500).send((error as Error).message);
}
}