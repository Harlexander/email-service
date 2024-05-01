"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scanEmails = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const fs = require('fs');
const { promisify } = require('util');
const appendFileAsync = promisify(fs.appendFile);
const { performance } = require('perf_hooks');
// ...
const scanEmails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const startTime = performance.now();
    const connection = new ioredis_1.default({
        host: 'redis-14692.c321.us-east-1-2.ec2.cloud.redislabs.com',
        port: 14692,
        password: "jgIl3D0x1L32V0h8bsf5UuU4cCdZj0tJ",
        maxRetriesPerRequest: null
    });
    const myQueue = new bullmq_1.Queue('email', { connection });
    const worker = new bullmq_1.Worker('email', (job) => __awaiter(void 0, void 0, void 0, function* () {
    }), { connection });
    worker.on('completed', (job, { status }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`${job.data.email} : ${status}!`);
    }));
    worker.on('failed', (job, err) => {
        res.send(`${job === null || job === void 0 ? void 0 : job.id} has failed with ${err.message}`);
    });
    res.send("results");
});
exports.scanEmails = scanEmails;
