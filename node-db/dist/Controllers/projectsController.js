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
exports.deleteProject = exports.updateProjects = exports.getOneProjectsByUserIdController = exports.getOneProjectController = exports.getAllProjectsController = exports.createProjectController = void 0;
const mssql_1 = __importDefault(require("mssql"));
const uuid_1 = require("uuid");
const config_1 = require("../Config/config");
const userValidator_1 = require("../Helper/userValidator");
const createProjectController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        console.log(req.body);
        // Validate REQ BODY (JOI)
        const { error } = userValidator_1.createProjectSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ message: error === null || error === void 0 ? void 0 : error.details[0].message });
        }
        //validate if userId exist
        const result = yield pool
            .request()
            .input("id", req.body.userId)
            .execute("getUserById");
        const { recordset } = result;
        if (recordset.length === 0) {
            return res.status(404).send({ message: "user not found" });
        }
        const id = (0, uuid_1.v4)();
        const { name, userId, description, duedate } = req.body;
        yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .input('name', mssql_1.default.VarChar, name)
            .input('description', mssql_1.default.VarChar, description)
            .input('userId', mssql_1.default.VarChar, userId)
            .input('duedate', mssql_1.default.VarChar, duedate)
            .execute('createProject');
        // Get Created project
        const projectsResult = yield pool
            .request()
            .input("id", id)
            .execute("getProjectById");
        const project = projectsResult.recordset[0];
        res.send({ message: "project created succefully", project: project, success: true });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error: " + error.message, success: false });
    }
});
exports.createProjectController = createProjectController;
const getAllProjectsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        const projects = yield pool.request().execute('getAllProjects');
        const { recordset } = projects;
        res.json({ projects: recordset });
    }
    catch (error) {
        res.json({ error });
    }
});
exports.getAllProjectsController = getAllProjectsController;
const getOneProjectController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        const projects = yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('getProjectById');
        const { recordset } = projects;
        if (!projects.recordset[0]) {
            return res.status(404).send({ message: `Project with id '${id}' not found` });
        }
        res.send({ projects: recordset[0] });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error: " + error.message });
    }
});
exports.getOneProjectController = getOneProjectController;
const getOneProjectsByUserIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        const projects = yield pool.request()
            .input('userId', mssql_1.default.VarChar, id)
            .execute('getProjectsByUserId');
        const { recordset } = projects;
        res.send({ projects: recordset, success: true });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error: " + error.message, success: false });
    }
});
exports.getOneProjectsByUserIdController = getOneProjectsByUserIdController;
const updateProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate REQ BODY (JOI)
        const { error } = userValidator_1.updateProjectSchema.validate(req.body);
        if (error) {
            return res.status(400).send({ message: error === null || error === void 0 ? void 0 : error.details[0].message, success: false });
        }
        const id = req.params.id;
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        const { name, description, userId, duedate } = req.body;
        const projects = yield pool.request()
            .input('id', mssql_1.default.VarChar, id)
            .execute('getProjectById');
        if (!projects.recordset[0]) {
            res.json({ message: "project not found" });
        }
        else
            yield pool.request()
                .input('id', mssql_1.default.VarChar, id)
                .input('name', mssql_1.default.VarChar, name)
                .input('description', mssql_1.default.VarChar, description)
                .input('userId', mssql_1.default.VarChar, userId)
                .input('duedate', mssql_1.default.VarChar, duedate)
                .execute('updateProjects');
        res.json({ message: "project updated" });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error: " + error.message, success: false });
    }
});
exports.updateProjects = updateProjects;
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const pool = yield mssql_1.default.connect(config_1.sqlConfig);
        yield pool.request().query(`DELETE FROM projects WHERE id='${id}'`);
        res.json({ message: 'projects deleted', success: true });
    }
    catch (error) {
        res.status(500).send({ message: "Internal Server Error: " + error.message, success: false });
    }
});
exports.deleteProject = deleteProject;
