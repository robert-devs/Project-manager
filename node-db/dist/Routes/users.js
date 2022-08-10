"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const userController_1 = require("../Controllers/userController");
//get all users
router.get('/', userController_1.getUsers);
//get one user
router.get('/:id', userController_1.getOneUser);
// Register User
router.post('/register', userController_1.registerUserController);
// Login User
router.post('/login', userController_1.loginUserController);
// Update User
router.put('/:id', userController_1.updateUser);
// Delete User
router.delete('/:id', userController_1.deleteUser);
exports.default = router;
