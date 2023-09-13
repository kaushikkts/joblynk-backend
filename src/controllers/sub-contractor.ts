import express from "express";

import {
    createSubContractor,
    deleteSubContractor,
    findAllSubContractors,
    findDocumentsForSubcontractor,
    findSubContractor,
    getTradesmanQuestionnaire,
    updateSubContractor,
    sendAgreementEmailToContractor,
    uploadTradesmanQuestionnaire
} from "../database/sub-contractor";
import {sendAppRegistrationEmail} from "../database/amazon.ses";
import {sendRegistrationEmailToContractor} from "./authentication";


export const createNewSubContractor = async (req: express.Request, res: express.Response) => {
    // console.log('controller value', req.body);
    // console.log('controller', req.body.contractorId, req.body.subcontractor);
    const subcontractor: any = req.body?.subcontractor;
    const contractorId: string = req.body.contractorId;
    try {
        const saveSubcontractor = await createSubContractor(contractorId, subcontractor);
        return res.json(saveSubcontractor);
    } catch (e) {
        console.log(e);
        res.status(400).json({message: e});
    }
}

export const delSubContractor = async (req: express.Request, res: express.Response) => {
    const subcontractorId = req.body?.subcontractorId;
    const contractorId = req.body?.contractorId;
    try {
        const result = await deleteSubContractor(subcontractorId, contractorId);
        return res.json(result);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const findASubContractor = async (req: express.Request, res: express.Response) => {
    const contractorId = req.params?.contractorId;
    const subcontractorId = req.params?.subcontractorId;
    console.log('Find a subcontractor: - ', contractorId, subcontractorId);
    try {
        const result = await findSubContractor(contractorId, subcontractorId);
        return res.json(result);
    } catch (e) {
        return res.status(400).json(e);
    }
}

export const getAllSubContractors = async (req: express.Request, res: express.Response) => {
    const contractorId = req.params?.contractorId;

    try {
        const result = await findAllSubContractors(contractorId);
        console.log('Value of find all subs', result);
        res.json(result);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const updateSubcontractor = async (req: express.Request, res: express.Response) => {
    const subcontractor = req?.body?.subcontractor;
    const contractorId = req?.body.contractorId;
    try {
        const result = await updateSubContractor(contractorId, subcontractor);
        console.log('Update subcontractor controller.ts file : - ',result);
        res.json(result);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const registerSubEmailSend = async (req: express.Request, res: express.Response) => {
    const { subcontractorEmail, contractorEmail } = req?.body;
    try {
        const result = await sendAppRegistrationEmail(subcontractorEmail, contractorEmail, "SUBCONTRACTOR");
        res.json(result?.$response);
    } catch (e) {
        return res.status(400).send(e);
    }
}

export const findSubcontractorDocuments = async (req: express.Request, res: express.Response) => {
    const email = req.params?.subcontractorEmail;
    console.log('controllers/subcontractor findDocuments method: - ', email);
    try {
        const documents = await findDocumentsForSubcontractor(email);
        res.json(documents);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const uploadQuestionnaire = async (req: express.Request, res: express.Response) => {
    const {questionnaire, subcontractorEmail } = req.body;
    console.log('controllers/subcontractor upload questionnaire method: - ', questionnaire, subcontractorEmail);
    try {
        const questionnaireUplaod = await uploadTradesmanQuestionnaire(questionnaire, subcontractorEmail);
        res.json(questionnaireUplaod);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const getQuestionnaire = async (req: express.Request, res: express.Response) => {
    const subcontractorEmail = req.params?.subcontractorEmail;
    console.log('controllers/subcontractor get questionnaire method: - ', subcontractorEmail);
    try {
        const questionnaire = await getTradesmanQuestionnaire(subcontractorEmail);
        res.json(questionnaire);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const sendTradesmanAgreementToSubcontractor = async(req: express.Request, res: express.Response) => {
    const {subcontractorEmail, contractor} = req?.body;
    try {
        const result = await sendAgreementEmailToContractor(subcontractorEmail, contractor.id, contractor.email);
        res.status(200).json(result);
    }catch (e) {
        res.status(400).json(e);
    }
}