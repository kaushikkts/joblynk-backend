import {connectToDatabase} from "./database-functions";
import {MongoClient, ObjectId} from "mongodb";
import { MaterialSourcesModel } from "../models/material-sources.model";

const DB_NAME = 'joblynk';
const COLLECTION = 'contractor';

export const getAllMaterialAndSources = async (contractorId: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        // find the contractor, and then pull the Service Partner array
        const contractor = await client.db(DB_NAME).collection(COLLECTION).findOne({_id: new ObjectId(contractorId)});
        console.log('Fetching the contractor object: - ', contractor);
        return contractor?.materialSources ? contractor.materialSources : null;
    } catch (e) {
        console.log(`Error in getAllMaterialAndSources database/material-sources.ts file : - ${e}`);
        throw e;
    } finally {
        await client.close();
    }
}

export const createAdditionalSource = async(matSource: MaterialSourcesModel) => {

    let client: MongoClient;
    try {
        client = await connectToDatabase();
        // check if materialSources exists
        const contractor = await client.db(DB_NAME).collection(COLLECTION).findOne({_id: new ObjectId(matSource.contractorId)});
        console.log(contractor);
        // if (!contractor?.materialSources) {
            return await client.db(DB_NAME).collection(COLLECTION).updateOne({_id: new ObjectId(matSource.contractorId)}, {
                $set: {
                    "materialSources": matSource
                }
            })
    } catch (e) {
        console.log(`Error in createSource database/material-sources.ts file : - ${e}`);
        throw e;
    }
}

export const deleteASource = async(materialSource: MaterialSourcesModel) => {

    let client: MongoClient;
    try {
        client = await connectToDatabase();
        // check if materialSources exists
        const contractor = await client.db(DB_NAME).collection(COLLECTION).findOne({_id: new ObjectId(materialSource.contractorId)});
        console.log(contractor);
        // if (!contractor?.materialSources) {
        return await client.db(DB_NAME).collection(COLLECTION).updateOne({_id: new ObjectId(materialSource.contractorId)}, {
            $set: {
                "materialSources": materialSource
            }
        })
    } catch (e) {
        console.log(`Error in deleteSource database/material-sources.ts file : - ${e}`);
        throw e;
    }
}

export const updateASource = async(source: MaterialSourcesModel) => {

    let client: MongoClient;
    try {
        client = await connectToDatabase();
        // check if materialSources exists
        const contractor = await client.db(DB_NAME).collection(COLLECTION).findOne({_id: new ObjectId(source.contractorId)});
        console.log(contractor);
        // if (!contractor?.materialSources) {
        return await client.db(DB_NAME).collection(COLLECTION).updateOne({_id: new ObjectId(source.contractorId)}, {
            $set: {
                "materialSources": source
            }
        })
    } catch (e) {
        console.log(`Error in updateSource database/material-sources.ts file : - ${e}`);
        throw e;
    }
}