import express from "express";
import {createNewContractor, findAContractor, findAllContractors, updateContrator, deleteAContractor} from "../controllers/contractors";
import {verifyToken} from "../middleware/auth-verify";

export default (router: express.Router) => {
    router.get('/contractor/getAllContractors',verifyToken, findAllContractors);
    router.get('/contractor/findContractor/:id',verifyToken, findAContractor);
    router.post('/contractor/create', verifyToken, createNewContractor);
    router.put('/contractor/update',verifyToken, updateContrator);
    router.delete('/contractor/delete',verifyToken, deleteAContractor);



}