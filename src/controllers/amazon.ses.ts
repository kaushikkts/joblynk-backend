import express from "express";

import {updateSubcontractorObject} from "../database/amazon.ses";


export const updateContractorWithNewSubContractorStatus = async(req: express.Request, res: express.Response) => {
    try {
        const { contractorId, primaryContactEmail } = req?.body;
        if (!contractorId) {
            return res.status(400).json('ContractorId not present');
        }

        if (!primaryContactEmail) {
            return res.status(400).json('Subcontractor email not present');
        }
        const response = await updateSubcontractorObject(contractorId, primaryContactEmail);
        console.log('Value of contractors', response);
        return res.json(response);
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
}