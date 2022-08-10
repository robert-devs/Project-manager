"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectSchema = exports.createProjectSchema = exports.updateUserSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const joi_1 = __importDefault(require("joi"));
var UserRole;
(function (UserRole) {
    UserRole["admin"] = "admin";
    UserRole["user"] = "user";
})(UserRole || (UserRole = {}));
exports.registerUserSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(30).required(),
    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    name: joi_1.default.string().min(5).required(),
    password: joi_1.default.string().min(8).required(),
    role: joi_1.default.string().valid(...Object.values(UserRole)).required(),
});
exports.loginUserSchema = joi_1.default.object({
    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: joi_1.default.string().min(8).required(),
});
exports.updateUserSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(30).required(),
    email: joi_1.default.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    name: joi_1.default.string().min(5).required(),
    role: joi_1.default.string().valid(...Object.values(UserRole)).required(),
});
// PROJECT SCHEMA
exports.createProjectSchema = joi_1.default.object({
    name: joi_1.default.string().min(5).required(),
    userId: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    duedate: joi_1.default.string().required()
});
exports.updateProjectSchema = joi_1.default.object({
    name: joi_1.default.string().min(5).required(),
    userId: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    duedate: joi_1.default.string().required()
});
