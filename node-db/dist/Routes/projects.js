"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectsController_1 = require("../Controllers/projectsController");
const router = (0, express_1.Router)();
//Create projects
router.post("/create", projectsController_1.createProjectController);
//get All Projects
router.get("/all", projectsController_1.getAllProjectsController);
//get one project
router.get("/:id", projectsController_1.getOneProjectController);
//updates projectes
router.put("/:id", projectsController_1.updateProjects);
//delete projects
router.delete("/:id", projectsController_1.deleteProject);
exports.default = router;
