import express from "express";

import {
    getAContractor,
    getAllContractors,
    createContractor,
    updateContractor,
    deleteContractor
} from "../database/contractor";
import {ContractorModel} from "../models/contractor.model";


export const findAllContractors = async(req: express.Request, res: express.Response) => {
    try {
        const contractors = await getAllContractors();
        console.log('Value of contractors', contractors);
        return res.json(contractors);
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
}

export const findAContractor = async (req: express.Request, res: express.Response) => {
    const id = req.params['id'];
    console.log(id);
    try {
        const contractor = await getAContractor(id);
        res.json(contractor);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const createNewContractor = async (req: express.Request, res: express.Response) => {
    const contractorData: ContractorModel = req.body;
    try {
        const saveContractor = await createContractor(contractorData);
        return res.json(saveContractor);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const updateContrator = async (req: express.Request, res: express.Response) => {
    const data: ContractorModel = req.body;
    try {
        const update = await updateContractor(data);
        return res.json(update);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const deleteAContractor = async (req: express.Request, res: express.Response) => {
    const id: string = req.body['id'];
    try {
        const del = await deleteContractor(id);
        return res.json(del);
    } catch (e) {
        res.status(400).json(e);
    }
}