"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promisePool = exports.connection = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
;
exports.connection = new ioredis_1.default({
    host: 'redis-14692.c321.us-east-1-2.ec2.cloud.redislabs.com',
    port: 14692,
    password: "jgIl3D0x1L32V0h8bsf5UuU4cCdZj0tJ",
    maxRetriesPerRequest: null
});
const mysql = require('mysql2');
const validateDb = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "costal-313235b529",
    connectionLimit: 10 // Adjust as needed
});
exports.promisePool = validateDb.promise();
