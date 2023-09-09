import express from "express";
import {verifyToken} from "../middleware/auth-verify";
import { getAllEmployees, createNewEmployee, deleteAnEmployee, updateAnEmployee } from "../controllers/employees";

export default (router: express.Router) => {
    router.get('/employee/getAllEmployees/:contractorId',verifyToken, getAllEmployees);
    router.post('/employee/create', verifyToken, createNewEmployee);
    router.put('/employee/update',verifyToken, updateAnEmployee);
    router.delete('/employee/delete',verifyToken, deleteAnEmployee);
}