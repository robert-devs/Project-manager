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
exports.deleteUser = exports.updateUser = exports.getOneUser = exports.getUsers = exports.registerUserController = exports.loginUserController = void 0;
const mssql_1 = __importDefault(require("mssql"));
const config_1 = require("../Config/config");
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userValidator_1 = require("../Helper/userValidator");
const loginUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        // Validate REQ BODY (JOI)
        const { error } = userValidator_1.loginUserSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ message: error === null || error === void 0 ? void 0 : error.details[0].message, success: false });
        }
        // Validate email exist in db
        const result = yield pool
            .request()
            .input("email", req.body.email)
            .execute("getUserByEmail");
        const { recordset } = result;
        if (recordset.length === 0) {
            return res.status(404).send({ message: "Email not found", success: false });
        }
        const user = recordset[0];
        // Validate correct password
        const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(404).send({ message: "Invalid password provided", success: false });
        }
        // Generate token
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "");
        // Return response with user and token    
        res.json({ message: 'Login successful', user, token, success: true });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error: " + error.message, success: false });
    }
});
exports.loginUserController = loginUserController;
const registerUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const id = (0, uuid_1.v4)();
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        console.log(req.body);
        // Validate REQ BODY (JOI)
        const { error } = userValidator_1.registerUserSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ message: error === null || error === void 0 ? void 0 : error.details[0].message, success: false });
        }
        // Validate Email Is Unique - does not exist in database
        const result = yield pool
            .request()
            .input("email", req.body.email)
            .execute("getUserByEmail");
        const { recordset } = result;
        if (recordset.length > 0) {
            return res.status(400).send({ message: "Email already registered", success: false });
        }
        // HASH Password (bcrypt)
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, salt);
        // Insert Data to DB
        const { username, name, role, email } = req.body;
        yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .input('username', mssql_1.default.VarChar, username)
            .input('name', mssql_1.default.VarChar, name)
            .input('email', mssql_1.default.VarChar, email)
            .input('role', mssql_1.default.VarChar, role)
            .input('password', mssql_1.default.VarChar, hashedPassword)
            .execute('createUser');
        // Get Created User
        const userResult = yield pool
            .request()
            .input("id", id)
            .execute("getUserById");
        const user = userResult.recordset[0];
        // Generate token with inserted data
        const token = jsonwebtoken_1.default.sign({ id, role: user.role }, (_b = process.env.JWT_SECRET) !== null && _b !== void 0 ? _b : "");
        // Return response with user and token    
        res.json({ message: 'user registered successfully', user, token, success: true });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error: " + error.message, success: false });
    }
});
exports.registerUserController = registerUserController;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        const users = yield pool.request().execute('getUsers');
        const { recordset } = users;
        res.json({ users: recordset, success: true });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error: " + error.message, success: false });
    }
});
exports.getUsers = getUsers;
const getOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        const users = yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('getUserById');
        const { recordset } = users;
        if (!recordset[0]) {
            return res.status(404).send({ message: `User with id '${id}' not found`, success: false });
        }
        res.send({ user: recordset[0], success: true });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error: " + error.message, success: false });
    }
});
exports.getOneUser = getOneUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate REQ BODY (JOI)
        const { error } = userValidator_1.updateUserSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ message: error === null || error === void 0 ? void 0 : error.details[0].message, success: false });
        }
        const id = req.params.id;
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        const { name, username, email, role } = req.body;
        const users = yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('getUserById');
        if (!users.recordset[0]) {
            return res.json({ message: "user not found", success: false });
        }
        yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .input('username', mssql_1.default.VarChar, username)
            .input('name', mssql_1.default.VarChar, name)
            .input('email', mssql_1.default.VarChar, email)
            .input('role', mssql_1.default.VarChar, role)
            .execute('updateUser');
        // Get Update User
        const userResult = yield pool
            .request()
            .input("id", id)
            .execute("getUserById");
        const user = userResult.recordset[0];
        res.json({ message: "user updated", user, success: true });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error: " + error.message, success: false });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        // Valid user ID
        const usersResult = yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('getUserById');
        const { recordset } = usersResult;
        if (!recordset[0]) {
            return res.status(404).send({ message: `User with id '${id}' not found`, success: false });
        }
        const user = recordset[0];
        // Check if user has existing projects
        const projects = yield pool.request()
            .input('userId', mssql_1.default.VarChar, user.id)
            .execute('getProjectsByUserId');
        if (projects.recordset.length > 0) {
            return res.status(400).send({ message: `Cannot delete user. User already has projects assigned to them`, success: false });
        }
        yield pool.request().query(`DELETE FROM users WHERE id='${id}'`);
        res.json({ message: 'user deleted', success: true });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error: " + error.message, success: false });
    }
});
exports.deleteUser = deleteUser;
