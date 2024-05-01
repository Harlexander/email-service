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
exports.toDB = exports.validateDb = void 0;
const insertData_1 = require("../lib/insertData");
const readFile_1 = require("../lib/readFile");
const validateEmail_1 = require("../lib/validateEmail");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const mysql = require('mysql2');
exports.validateDb = mysql.createPool({
    host: "localhost",
    user: "data1_christemb",
    password: "KyGNiI4aSe-1",
    database: "data1_christemb",
    connectionLimit: 10 // Adjust as needed
});
const toDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield exports.validateDb.promise();
        const { databaseName, tableName, } = req.body;
        const { file } = req;
        if (file) {
            const validationData = {
                dbName: databaseName,
                tableName,
                file: file === null || file === void 0 ? void 0 : file.path
            };
            yield (0, insertData_1.insertData)(conn, "validation", validationData);
            yield validateEmails(databaseName, tableName, file);
        }
        res.send(file === null || file === void 0 ? void 0 : file.path);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
exports.toDB = toDB;
const validateEmails = (databaseName, tableName, file) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = mysql.createPool({
        host: "localhost",
        user: "data1_christemb",
        password: "KyGNiI4aSe-1",
        database: databaseName,
        connectionLimit: 10 // Adjust as needed
    });
    const connection = new ioredis_1.default({
        host: process.env.REDIS_HOST,
        port: 14692,
        password: process.env.REDIS_PASS,
        maxRetriesPerRequest: null
    });
    const promisePool = pool.promise();
    const myQueue = new bullmq_1.Queue('verify_email', { connection });
    const worker = new bullmq_1.Worker('verify_email', ({ data }) => __awaiter(void 0, void 0, void 0, function* () {
        const status = yield (0, validateEmail_1.validateEmail)(data.data.email);
        status && (yield (0, insertData_1.insertData)(promisePool, data.tableName, data.data));
        return { status };
    }), { connection });
    worker.on('completed', ({ data }, { status }) => __awaiter(void 0, void 0, void 0, function* () {
        yield recordValidation([data.databaseName, data.tableName, data.file], status);
    }));
    worker.on('failed', (job, err) => {
        console.log(`${job === null || job === void 0 ? void 0 : job.id} has failed with ${err.message}`);
    });
    if (file === null || file === void 0 ? void 0 : file.path) {
        const datas = yield (0, readFile_1.readCSVFile)(file.path);
        const jobs = datas.map((content) => ({ name: "validateEmail", data: { databaseName, tableName, file: file.path, data: content } }));
        yield myQueue.addBulk(jobs);
    }
});
const recordValidation = (values, passed) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = exports.validateDb.promise();
    let sql = `UPDATE validation SET validated = validated + 1`;
    if (passed) {
        sql += `, passed = passed + 1`;
    }
    sql += ` WHERE dbName = ? AND tableName = ? AND file = ?`;
    yield conn.execute(sql, values);
});
