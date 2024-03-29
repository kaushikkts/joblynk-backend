import express from "express";
import {
    createServicePartner, deleteServicePartner,
    getAllServicePartners,
    updatePartner
} from "../database/service-partner";
import {ServicePartnersModel} from "../models/service-partners.model";


export const findAllServicePartners = async(req: express.Request, res: express.Response) => {
    try {
        const contractorId = req.params.contractorId;
        const servicePartners = await getAllServicePartners(contractorId);
        console.log('Value of service partners', servicePartners);
        return res.json(servicePartners);
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
}

// export const findAServicePartner = async (req: express.Request, res: express.Response) => {
//     const id = req.params['id'];
//     console.log(id);
//     try {
//         const contractor = await getAContractor(id);
//         res.json(contractor);
//     } catch (e) {
//         res.status(400).json(e);
//     }
// }
//
export const createNewServicePartner = async (req: express.Request, res: express.Response) => {

    const servicePartnersData: any = req.body;
    try {
        const result: any = await createServicePartner(servicePartnersData);
        if (result?.alreadyExists) {
            return res.status(400).json("Service Partner already exists");
        }
        return res.json(result);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const updateServicePartner = async (req: express.Request, res: express.Response) => {
    const data: ServicePartnersModel = req.body;
    try {
        const update = await updatePartner(data);
        return res.json(update);
    } catch (e) {
        res.status(400).json(e);
    }
}

export const deletePartner = async (req: express.Request, res: express.Response) => {
    const data: ServicePartnersModel = req.body;
    try {
        const del = await deleteServicePartner(data);
        return res.json(del);
    } catch (e) {
        res.status(400).json(e);
    }
}