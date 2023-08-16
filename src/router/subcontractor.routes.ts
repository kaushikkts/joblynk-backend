import express from "express";
import {
    createNewSubContractor,
    delSubContractor, findASubContractor, getAllSubContractors, updateSubcontractor
} from "../controllers/sub-contractor";
import {verifyToken} from "../middleware/auth-verify";

export default (router: express.Router) => {
    router.post('/subcontractor/create',verifyToken, createNewSubContractor);
    router.get('/subcontractor/findSubContractor/:contractorId/:subcontractorId',verifyToken, findASubContractor);
    router.get('/subcontractor/findAllSubContractors/:contractorId',verifyToken, getAllSubContractors);
    router.put('/subcontractor/update', verifyToken, updateSubcontractor);
    router.delete('/subcontractor/delete', verifyToken, delSubContractor);
}