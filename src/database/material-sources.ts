import {connectToDatabase} from "./database-functions";
import {MongoClient, ObjectId} from "mongodb";
import { MaterialSourcesModel} from "../models/material-sources.model";

const DB_NAME = 'joblynk';
const COLLECTION = 'contractor';

export const getAllMaterialAndSources = async (contractorId: string) => {
    let client: MongoClient;
    try {
        client = await connectToDatabase();
        // find the contractor, and then pull the Service Partner array
        const materialSources = await client.db(DB_NAME).collection(COLLECTION).find({_id: new ObjectId(contractorId)}).project({materialSources: 1}).toArray();
        console.log('Fetching the material sources object: - ', materialSources);
        return materialSources ? materialSources[0]?.materialSources : null;
    } catch (e) {
        console.log(`Error in getAllMaterialAndSources database/material-sources.ts file : - ${e}`);
        throw e;
    } finally {
        await client.close();
    }
}

export const createAdditionalSource = async(matSource: MaterialSourcesModel, contractorId: string) => {

    let client: MongoClient;
    try {
        client = await connectToDatabase();
        // check if materialSources exists
        matSource._id = new ObjectId().toString();
        return await client.db(DB_NAME).collection(COLLECTION).updateOne({_id: new ObjectId(contractorId)}, {
            $addToSet: {
                "materialSources": matSource
            }
        }, {upsert: true});
    } catch (e) {
        console.log(`Error in createSource database/material-sources.ts file : - ${e}`);
        throw e;
    }
}


export const deleteASource = async(contractorId: string, materialSource: MaterialSourcesModel) => {

    let client: MongoClient;
    try {
        client = await connectToDatabase();
        console.log(materialSource);
        // check if materialSources exists
        const result =  await client.db(DB_NAME).collection(COLLECTION).updateOne({_id: new ObjectId(contractorId)}, {
            $pull: {
                "materialSources": {
                        _id: materialSource._id,
                        material: materialSource.material
                }
            }
        });
        console.log(result);
        return result;
    } catch (e) {
        console.log(`Error in deleteSource database/material-sources.ts file : - ${e}`);
        throw e;
    }
}

export const updateMaterialAndSources = async(source: MaterialSourcesModel, contractorId: string) => {

    let client: MongoClient;
    try {
        console.log('Update MaterialAndSources: - ', source, contractorId);
        client = await connectToDatabase();
        // check if materialSources exists
        return await client.db(DB_NAME).collection(COLLECTION).updateOne({_id: new ObjectId(contractorId), "materialSources._id": source._id}, {
            $set: {
                "materialSources.$.material": source.material,
                "materialSources.$.primarySource": source.primarySource,
                "materialSources.$.primarySourceWebsite": source.primarySourceWebsite,
                "materialSources.$.secondarySource": source.secondarySource,
                "materialSources.$.secondarySourceWebsite": source.secondarySourceWebsite,
                "materialSources.$.alternateSource": source.alternateSource,
                "materialSources.$.alternateSourceWebsite": source.alternateSourceWebsite

            }
        });

    } catch (e) {
        console.log(`Error in updateSource database/material-sources.ts file : - ${e}`);
        throw e;
    }
}