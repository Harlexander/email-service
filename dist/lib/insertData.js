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
exports.insertData = void 0;
function insertData(promisePool, tableName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [keys, values, count] = extract(data);
            const [rows] = yield promisePool.execute(`INSERT INTO ${tableName} (${keys}) VALUES (${count})`, values);
            console.log(`${rows.affectedRows} row(s) inserted.`);
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
}
exports.insertData = insertData;
const extract = (obj) => {
    const keys = Object.keys(obj).join(",");
    const values = Object.values(obj);
    const count = Array(values.length).fill("?").join(",");
    return [keys, values, count];
};
