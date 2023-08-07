import express from "express";
import {
    createNewServicePartner,
    findAllServicePartners, updateServicePartner, deletePartner
} from "../controllers/service-partner";

export default (router: express.Router) => {
    router.get('/service-partner/getAllServicePartners/:contractorId', findAllServicePartners);
    // router.get('/contractor/findContractor/:id', findAContractor);
    router.post('/service-partner/create', createNewServicePartner);
    router.put('/service-partner/update', updateServicePartner);
    router.delete('/service-partner/delete', deletePartner);

}