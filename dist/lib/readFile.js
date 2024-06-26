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
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCSVFile = void 0;
const csv = require('csv-parser');
const fs = require('fs');
const readCSVFile = (filepath) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const jsonArray = [];
        fs.createReadStream(filepath)
            .pipe(csv())
            .on('data', (row) => {
            jsonArray.push(row);
        })
            .on('end', () => {
            resolve(jsonArray);
        })
            .on('error', (error) => {
            console.error('Error reading CSV file:', error.message);
            reject({ error: 'Internal Server Error' });
        });
    });
});
exports.readCSVFile = readCSVFile;
