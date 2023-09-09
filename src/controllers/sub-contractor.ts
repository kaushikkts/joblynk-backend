import express from "express";

import {
    createSubContractor,
    deleteSubContractor,
    findAllSubContractors,
    findDocumentsForSubcontractor,
    findSubContractor,
    getTradesmanQuestionnaire,
    sendRegisterSubContractorEmail,
    updateSubContractor,
    uploadTradesmanQuestionnaire
} from "../database/sub-contractor";


export const createNewSubContractor = async (req: express.Request, res: express.Response) => {
    // console.log('controller value', req.body);
    // console.log('controller', req.body.contractorId, req.body.subcontractor);
    const subcontractor: any = req.body?.subcontractor;
    const contractorId: string = req.body.contractorId;
    try {
        const saveSubcontractor = await createSubContractor(contractorId, subcontractor);
        return res.json(saveSubcontractor);
    } catch (e) {
        res.status(400).json(e);
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
        console.log(result);
        return res.json(result);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const updateSubcontractor = async (req: express.Request, res: express.Response) => {
    const subcontractor = req?.body?.subcontractor;
    const contractorId = req?.body.contractorId;
    try {
        const result = updateSubContractor(contractorId, subcontractor);
        res.json(result);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const registerSubEmailSend = async (req: express.Request, res: express.Response) => {
    const { subcontractorEmail, contractorId } = req?.body;
    // console.log(req.body);
    // console.log('Entered registerSubEmailSend: - ', contractorId, subcontractorEmail);
    try {
        const result = await sendRegisterSubContractorEmail(contractorId, subcontractorEmail);
        res.json(result.$response);
    } catch (e) {
        return res.status(400).json(e);
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