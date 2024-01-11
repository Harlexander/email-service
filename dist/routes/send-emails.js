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
const emailTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = new ioredis_1.default({
            host: 'redis-14692.c321.us-east-1-2.ec2.cloud.redislabs.com',
            port: 14692,
            password: "jgIl3D0x1L32V0h8bsf5UuU4cCdZj0tJ",
            maxRetriesPerRequest: null
        });
        const myQueue = new bullmq_1.Queue('foo', { connection });
        const worker = new bullmq_1.Worker('foo', (job) => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise(resolve => setTimeout(resolve, 30000));
            console.log(job.data);
        }), { connection });
        worker.on('completed', (job) => {
            console.log(`${job.id} has completed!`);
        });
        worker.on('failed', (job, err) => {
            res.send(`${job === null || job === void 0 ? void 0 : job.id} has failed with ${err.message}`);
        });
        function addJobs() {
            return __awaiter(this, void 0, void 0, function* () {
                yield myQueue.add('myJobName', { foo: 'bar' });
                yield myQueue.add('myJobName', { qux: 'baz' });
                yield myQueue.add('myJobName', { qux: 'bcanaz' });
                yield myQueue.add('myJobName', { qux: 'tar' });
                yield myQueue.add('myJobName', { qux: 'dan' });
                yield myQueue.add('myJobName', { foo: 'bar' });
                yield myQueue.add('myJobName', { qux: 'baz' });
                yield myQueue.add('myJobName', { qux: 'bcanaz' });
                yield myQueue.add('myJobName', { qux: 'tar' });
                yield myQueue.add('myJobName', { qux: 'dan' });
                yield myQueue.add('myJobName', { foo: 'bar' });
                yield myQueue.add('myJobName', { qux: 'baz' });
                yield myQueue.add('myJobName', { qux: 'bcanaz' });
                yield myQueue.add('myJobName', { qux: 'tar' });
                yield myQueue.add('myJobName', { qux: 'dan' });
            });
        }
        yield addJobs();
        res.send("omom man");
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.emailTasks = emailTasks;
