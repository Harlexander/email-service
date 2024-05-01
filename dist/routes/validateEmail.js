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
exports.emailTasks = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const validateEmail_1 = require("../lib/validateEmail");
const readFile_1 = require("../lib/readFile");
const bottleneck_1 = __importDefault(require("bottleneck"));
const fs = require('fs').promises;
const path = require('path');
const emailTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const limiter = new bottleneck_1.default({
            maxConcurrent: 10,
            minTime: 10000
        });
        const limiterValidateEmail = limiter.wrap((job) => __awaiter(void 0, void 0, void 0, function* () {
            const { email } = job.data;
            const status = yield (0, validateEmail_1.validateEmail)(email);
            return { status };
        }));
        const connection = new ioredis_1.default({
            host: 'redis-14692.c321.us-east-1-2.ec2.cloud.redislabs.com',
            port: 14692,
            password: "jgIl3D0x1L32V0h8bsf5UuU4cCdZj0tJ",
            maxRetriesPerRequest: null
        });
        const myQueue = new bullmq_1.Queue('validate', { connection });
        const worker = new bullmq_1.Worker('validate', (job) => __awaiter(void 0, void 0, void 0, function* () {
            const { email } = job.data;
            const status = yield (0, validateEmail_1.validateEmail)(email);
            return { status };
        }), { connection });
        worker.on('completed', (job, { status }) => __awaiter(void 0, void 0, void 0, function* () {
            if (status) {
                yield writeResultToCSV(job.data);
            }
            console.log(job.data, status);
        }));
        worker.on('failed', (job, err) => {
            res.send(`${job === null || job === void 0 ? void 0 : job.id} has failed with ${err.message}`);
        });
        function addJobs() {
            return __awaiter(this, void 0, void 0, function* () {
                const filePath = `./public/small.csv`;
                const emails = yield (0, readFile_1.readCSVFile)(filePath);
                console.log(emails);
                const jobs = [emails[0], emails[1]].map((data) => ({ name: "myJobName", data }));
                yield myQueue.addBulk(jobs);
            });
        }
        yield addJobs();
        res.send("task running");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.emailTasks = emailTasks;
function objectToCsvLine(obj) {
    const values = Object.values(obj).map(value => {
        // Ensure values are properly formatted (e.g., wrap in double quotes if needed)
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    return values.join(',');
}
function writeResultToCSV(result) {
    return __awaiter(this, void 0, void 0, function* () {
        const outputPath = './public/results.csv';
        try {
            const csvLine = objectToCsvLine(result);
            console.log(csvLine);
            // await fs.appendFile(outputPath, csvLine);
        }
        catch (error) {
            console.error(`Error writing result to CSV: ${error.message}`);
        }
    });
}
