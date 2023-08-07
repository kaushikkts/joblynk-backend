import express from "express";
import {createNewContractor, findAContractor, findAllContractors, updateContrator, deleteAContractor} from "../controllers/contractors";

export default (router: express.Router) => {
    router.get('/contractor/getAllContractors', findAllContractors);
    router.get('/contractor/findContractor/:id', findAContractor);
    router.post('/contractor/create', createNewContractor);
    router.put('/contractor/update', updateContrator);
    router.delete('/contractor/delete', deleteAContractor);



}