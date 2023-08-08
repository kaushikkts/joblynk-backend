import express from "express";
import {
    createNewSubContractor,
    delSubContractor, findASubContractor, getAllSubContractors
} from "../controllers/sub-contractor";

export default (router: express.Router) => {
    router.post('/subcontractor/create', createNewSubContractor);
    router.get('/subcontractor/findSubContractor/:id', findASubContractor);
    router.get('/subcontractor/findAllSubContractors', getAllSubContractors);
    // router.post('/service-partner/create', createNewServicePartner);
    // router.put('/service-partner/update', updateServicePartner);
    router.delete('/subcontractor/delete', delSubContractor);
}