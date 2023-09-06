import express from "express";
import {
    createAdditionalSource,
    deleteASource,
    getAllMaterialAndSources,
    updateMaterialAndSources
} from "../database/material-sources";

export const findAllMaterialAndSources = async(req: express.Request, res: express.Response) => {
    try {
        const contractorId = req.params.contractorId;
        const materialAndSources = await getAllMaterialAndSources(contractorId);
        // console.log('Value of Material and sources: - ', materialAndSources);
        return res.json(materialAndSources);
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
}

export const createNewSource = async(req: express.Request, res: express.Response) => {
    try {
        const data = req?.body;

        const materialAndSources = await createAdditionalSource(data);
        console.log('Value of Material and sources: - ', materialAndSources);
        return res.json(materialAndSources);
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
}

export const deleteSource = async(req: express.Request, res: express.Response) => {
    try {
        const data = req?.body;

        const sources = await deleteASource(data);
        console.log('Value of Material and sources: - ', sources);
        return res.json(sources);
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
}

export const updateSource = async(req: express.Request, res: express.Response) => {
    try {
        const {sourceToBeUpdated, contractorId} = req?.body;
        const sources = await updateMaterialAndSources(sourceToBeUpdated, contractorId);
        console.log('Value of Material and sources: - ', sources);
        return res.json(sources);
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
}