import IORedis from 'ioredis';

export interface MyJobData {
  databaseName : string;
  tableName : string;
  file : string;
  data : Record<string, string>
};

export const connection = new IORedis({
    host: 'redis-14692.c321.us-east-1-2.ec2.cloud.redislabs.com',
    port: 14692,
    password : "jgIl3D0x1L32V0h8bsf5UuU4cCdZj0tJ",
    maxRetriesPerRequest : null
  });

  const mysql = require('mysql2');

  const validateDb = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "costal-313235b529",
      connectionLimit: 10 // Adjust as needed
  });
  
export const promisePool = validateDb.promise();
  