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
const ejs_1 = __importDefault(require("ejs"));
const mssql_1 = __importDefault(require("mssql"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../Config/config");
const Email_1 = __importDefault(require("../Helpers.ts/Email"));
dotenv_1.default.config();
const SendEmails = () => __awaiter(void 0, void 0, void 0, function* () {
    const pool = yield mssql_1.default.connect(config_1.sqlConfig);
    const projects = yield (yield pool.request().query(`SELECT * FROM projects WHERE issent='0'`)).recordset;
    for (let project of projects) {
        // get user by id using project.userId
        const users = yield pool.request()
            .input('id', mssql_1.default.VarChar, project.userId)
            .execute('getUserById');
        const { recordset } = users;
        if (recordset.length > 0) {
            const user = recordset[0];
            console.log({ user });
            ejs_1.default.renderFile('templates/taskassigned.ejs', { name: user.name, task: project.name }, (error, data) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    console.log(error);
                    return;
                }
                let messageoption = {
                    from: process.env.EMAIL,
                    to: user.email,
                    subject: "Jitu Project Task",
                    html: data
                };
                try {
                    console.log('Sending Email');
                    yield (0, Email_1.default)(messageoption);
                    yield pool.request().query(`UPDATE projects SET issent='1' WHERE id = '${project.id}'`);
                    console.log('Email is Sent');
                }
                catch (error) {
                    console.log(error);
                }
            }));
        }
    }
});
exports.default = SendEmails;
