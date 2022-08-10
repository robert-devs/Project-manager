import { Router } from "express";
import { createProjectController, deleteProject, getAllProjectsController, getOneProjectController, updateProjects } from "../Controllers/projectsController";

const router = Router()

//Create projects
router.post("/create", createProjectController)

//get All Projects
router.get("/all", getAllProjectsController)

//get one project
router.get("/:id", getOneProjectController)

//updates projectes
router.put("/:id",updateProjects)

//delete projects

router.delete("/:id",deleteProject)
export default router