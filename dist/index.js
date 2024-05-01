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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const validateEmail_1 = require("./routes/validateEmail");
const emailDispatch_1 = require("./routes/emailDispatch");
const insertData_1 = require("./routes/insertData");
const path_1 = __importDefault(require("path"));
const verifyEmail_1 = require("./routes/verifyEmail");
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });
const ejs = require('ejs');
const moment = require('moment');
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
app.set('views', path_1.default.join(__dirname, 'dashboard'));
app.set('view engine', 'ejs');
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = insertData_1.validateDb.promise();
        const query = 'SELECT * FROM validation';
        const data = yield conn.execute(query);
        const formattedData = data[0].map((data) => (Object.assign(Object.assign({}, data), { createdAt: moment(data.createdAt).format('MMM Do, h:mm:ss a') })));
        res.render("index", { data: formattedData });
    }
    catch (error) {
        res.send(error.message);
    }
}));
app.post("/task", validateEmail_1.emailTasks);
app.post("/emails", emailDispatch_1.scanEmails);
app.post("/api/verify", verifyEmail_1.verifyEmail);
app.post("/database", upload.single("file"), insertData_1.toDB);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
