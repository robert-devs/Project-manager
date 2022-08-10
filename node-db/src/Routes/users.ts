import { Router } from "express";
const router =Router()
import { 
    deleteUser, 
    getOneUser, 
    getUsers, 
    registerUserController, 
    updateUser, 
    loginUserController 
} from "../Controllers/userController";


//get all users
router.get('/',getUsers)

//get one user
router.get('/:id',getOneUser)

// Register User
router.post('/register', registerUserController)

// Login User
router.post('/login', loginUserController)

// Update User
router.put('/:id',updateUser)

// Delete User
router.delete('/:id',deleteUser)

export default router


