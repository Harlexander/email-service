import { Request, Response } from "express";
import { readCSVFile } from "../lib/readFile";
import { validateEmail } from "../lib/validateEmail";

const fs = require('fs');
const { promisify } = require('util');
const appendFileAsync = promisify(fs.appendFile);

const { performance } = require('perf_hooks');

// ...

export const scanEmails = async (req:Request, res:Response) => {
    
    const startTime = performance.now();
        
    const filePath = `${__dirname}/public/${req.body.filename}`;

    const emails = await readCSVFile(filePath);
    
    const results = [];
    for (const emailObj of emails) {
        const email = emailObj.Email || emailObj.email;
        const status = await validateEmail(email);
        results.push({ email, status });
        console.log(status, email);
    }
    
    // Write the results to a new file
    const outputFilePath = `${__dirname}/public/validatedEmails.csv`;
    
    const outputLines = results.map(({ email, status }) => `${email},${status}`).join('\n');
    
    await appendFileAsync(outputFilePath, outputLines);

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    console.log(`Execution time: ${executionTime} milliseconds`);
    
    res.send(results);
    
}