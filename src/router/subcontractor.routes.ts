import express from "express";
import {
    createNewSubContractor,
    delSubContractor,
    findASubContractor,
    findSubcontractorDocuments,
    getAllSubContractors, getQuestionnaire,
    registerSubEmailSend,
    updateSubcontractor, uploadQuestionnaire
} from "../controllers/sub-contractor";
import {verifyToken} from "../middleware/auth-verify";

export default (router: express.Router) => {
    router.post('/subcontractor/create',verifyToken, createNewSubContractor);
    router.post('/subcontractor/register',verifyToken, registerSubEmailSend);
    router.get('/subcontractor/findSubContractor/:contractorId/:subcontractorId',verifyToken, findASubContractor);
    router.get('/subcontractor/documents/:subcontractorEmail',verifyToken, findSubcontractorDocuments);
    router.get('/subcontractor/findAllSubContractors/:contractorId',verifyToken, getAllSubContractors);
    router.post('/subcontractor/questionnaire', verifyToken, uploadQuestionnaire);
    router.get('/subcontractor/questionnaire/:subcontractorEmail', verifyToken, getQuestionnaire);
    router.put('/subcontractor/update', verifyToken, updateSubcontractor);
    router.delete('/subcontractor/delete', verifyToken, delSubContractor);
}