import express from "express";

import {SubcontractorModel} from "../models/subcontractor.model";
import {
    createSubContractor,
    deleteSubContractor,
    findAllSubContractors,
    findSubContractor
} from "../database/sub-contractor";


export const createNewSubContractor = async (req: express.Request, res: express.Response) => {
    // console.log('controller', req.body.contractorId, req.body.subcontractor);
    const subcontractor: any = req.body.subcontractor;
    const contractorId: string = req.body.contractorId;
    try {
        const saveSubcontractor = await createSubContractor(contractorId, subcontractor);
        return res.json(saveSubcontractor);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const delSubContractor = async (req: express.Request, res: express.Response) => {
    const id = req.body?.subcontractorId;
    try {
        const result = await deleteSubContractor(id);
        return res.json(result);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const findASubContractor = async (req: express.Request, res: express.Response) => {
    const id = req.params?.id;
    console.log(id);
    try {
        const result = await findSubContractor(id);
        return res.json(result);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const getAllSubContractors = async (req: express.Request, res: express.Response) => {
    try {
        const result = await findAllSubContractors();
        return res.json(result);
    } catch (e) {
        res.status(400).json(e);
    }
}